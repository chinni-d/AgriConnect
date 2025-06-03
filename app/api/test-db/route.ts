import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    console.log("Testing Supabase connection...")
    
    // Check if listings table exists and get its structure
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.error("Error checking tables:", tablesError)
      return NextResponse.json({ 
        error: "Cannot access database schema", 
        details: tablesError.message 
      }, { status: 500 })
    }
    
    console.log("Available tables:", tables)
    
    // Try to get the listings table structure
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'listings')
    
    if (columnsError) {
      console.error("Error checking listings table structure:", columnsError)
    }
    
    // Test a simple select on listings table
    const { data: listingsData, error: listingsError } = await supabase
      .from('listings')
      .select('*')
      .limit(1)
    
    return NextResponse.json({
      success: true,
      tables: tables?.map(t => t.table_name) || [],
      listingsTableExists: !listingsError,
      listingsColumns: columns || [],
      listingsError: listingsError?.message || null,
      sampleListings: listingsData || []
    })
    
  } catch (error: any) {
    console.error("Database test error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Test creating a minimal listing
    const testData = {
      sellerId: "test-seller-id",
      title: "Test Listing",
      description: "Test description",
      wasteType: "Agricultural",
      subtype: "Test",
      quantity: 1,
      unit: "kg",
      price: 100,
      location: "Test Location",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log("Testing listing creation with:", testData)
    
    const { data, error } = await supabase
      .from("listings")
      .insert(testData)
      .select()
    
    if (error) {
      console.error("Test insert error:", error)
      return NextResponse.json({
        success: false,
        error: "Failed to insert test listing",
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: "Test listing created successfully",
      data: data[0]
    })
    
  } catch (error: any) {
    console.error("Test creation error:", error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
