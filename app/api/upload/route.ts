import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      console.error("No file provided in upload request");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File size too large:", file.size);
      return NextResponse.json({ error: "File size too large. Maximum 5MB allowed." }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `listings/${fileName}`;

    // Convert file to buffer
    let buffer;
    try {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } catch (err) {
      console.error("Error converting file to buffer:", err);
      return NextResponse.json({ error: "Failed to process file buffer", details: String(err) }, { status: 500 });
    }

    // Try to upload to Supabase Storage
    let uploadResult, uploadError;
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false
        });
      uploadResult = data;
      uploadError = error;
    } catch (err) {
      console.error("Supabase upload threw error:", err);
      return NextResponse.json({ error: "Supabase upload threw error", details: String(err) }, { status: 500 });
    }

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      if (uploadError.message?.includes("Bucket not found") || uploadError.message?.includes("not found")) {
        return NextResponse.json({
          error: "Storage bucket not configured. Please create an 'images' bucket in your Supabase project.",
          details: "Go to Supabase Dashboard → Storage → Create a new bucket named 'images' with public access"
        }, { status: 500 });
      }
      return NextResponse.json({ error: `Failed to upload image: ${uploadError.message}` }, { status: 500 });
    }

    // Get public URL
    let publicUrlData;
    try {
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);
      publicUrlData = urlData;
    } catch (err) {
      console.error("Error getting public URL:", err);
      return NextResponse.json({ error: "Failed to get public URL", details: String(err) }, { status: 500 });
    }

    console.log("Image uploaded successfully:", { fileName, filePath, publicUrl: publicUrlData?.publicUrl });
    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData?.publicUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error("Upload error (outer catch):", error);
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 });
  }
}
