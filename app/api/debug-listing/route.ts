import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log("=== DEBUG LISTING DATA ===")
    console.log("Raw incoming data:", JSON.stringify(data, null, 2))
    
    // Check each required field
    const requiredFields = [
      "sellerId",
      "title", 
      "description",
      "wasteType",
      "subtype",
      "quantity",
      "unit", 
      "price",
      "location"
    ]
    
    const missing: string[] = []
    const fieldInfo: Record<string, any> = {}
    
    requiredFields.forEach(field => {
      const value = data[field]
      fieldInfo[field] = {
        value: value,
        type: typeof value,
        isNull: value === null,
        isUndefined: value === undefined,
        isEmpty: value === ""
      }
      
      if (!value) {
        missing.push(field)
      }
    })
    
    console.log("Field analysis:", JSON.stringify(fieldInfo, null, 2))
    console.log("Missing fields:", missing)
    
    return NextResponse.json({
      success: true,
      receivedData: data,
      fieldAnalysis: fieldInfo,
      missingFields: missing,
      message: missing.length > 0 
        ? `Missing required fields: ${missing.join(", ")}` 
        : "All required fields present"
    })
    
  } catch (error: any) {
    console.error("Debug error:", error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
