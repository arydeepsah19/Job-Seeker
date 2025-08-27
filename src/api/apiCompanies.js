import supabaseClient from "../utils/supabase";
import { supabaseUrl } from "../utils/supabase";

export async function getCompanies(token) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("companies")
        .select("*");

    if(error)
    {
        console.log("Error Fetching companies:", error);
        return null;
    }

    return data;
}

export async function addNewCompany(token, _, companyData) {
    const supabase = await  supabaseClient(token);

    const random = Math.floor(Math.random()*9000);
        const fileName = `logo-${random}-${companyData.name}`
    
        const {error: StorageError} = await supabase.storage
            .from("company-logo")
            .upload(fileName, companyData.logo);
    
        if(StorageError)
        {
            console.log("Error Uploading Company Logo:", StorageError);
            return null;
        }

        const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

        const {data,error} = await supabase.from("companies")
        .insert([
            {name: companyData.name,
             logo_url}
        ]).select();
    
        if(error){
            console.error("Error Submitting company:", error);
            return null;
        }
    
        return data;
}  