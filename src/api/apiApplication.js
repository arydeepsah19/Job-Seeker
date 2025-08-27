 import supabaseClient, { supabaseUrl } from "../utils/supabase";

export async function applyToJob(token, _, jobData) {
    const supabase = await  supabaseClient(token);

    const random = Math.floor(Math.random()*9000);
    const fileName = `resume-${random}-${jobData.candidate_id}`

    const {error: StorageError} = await supabase.storage
        .from("resumes")
        .upload(fileName, jobData.resume);

    if(StorageError)
    {
        console.log("Error Uploading Resume:", StorageError);
        return null;
    }

    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

    const {data,error} = await supabase.from("applications").insert([
        {...jobData, resume}
    ]).select();

    if(error){
        console.error("Error Submitting Applications:", error);
        return null;
    }

    return data;
}

export async function updateApplicationStatus(token, {application_id}, status) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("applications")
        .update({status})
        .eq("id", application_id)
        .select()

    if(error || data.length === 0)
    {
        console.log("Error Updating Application Status:", error);
        return null;
    }

    return data;
}

export async function getApplication(token, {user_id} ) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("applications")
        .select("*, job: jobs(title, company: companies(name))")
        .eq("candidate_id", user_id);

    if(error)
    {
        console.error("Error Fetching Application:", error);
        return null;
    }
    return data;
}
