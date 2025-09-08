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

// export async function withdrawApplication(token, { application_id, resumeUrl }) {
//     const supabase = await supabaseClient(token);

//     // 1. Delete application row
//     const { error: deleteError } = await supabase
//         .from("applications")
//         .delete()
//         .eq("id", application_id);

//     if (deleteError) {
//         console.error("Error deleting application:", deleteError);
//         return { success: false, error: deleteError };
//     }

//     // 2. Delete resume file if exists
//     if (resumeUrl) {
//         try {
//         // Extract file name from the resume URL
//         const fileName = resumeUrl.replace(
//             `${supabaseUrl}/storage/v1/object/public/resumes/`,
//             ""
//         );

//         const { error: storageError } = await supabase.storage
//             .from("resumes")
//             .remove([fileName]);

//         if (storageError) {
//             console.error("Error deleting resume file:", storageError);
//             // Not fatal — application is already withdrawn
//         }
//         } catch (err) {
//         console.error("Error parsing resume URL:", err);
//         }
//     }

//     return { success: true };
// }

export async function withdrawApplication(token, { application_id, resumeUrl }) {
  const supabase = await supabaseClient(token);

  try {
    console.log("🔎 withdrawApplication called with:", {
      application_id,
      resumeUrl,
    });

    // 1. Delete application row from table
    const { error: deleteError } = await supabase
      .from("applications")
      .delete()
      .eq("id", application_id);

    if (deleteError) {
      console.error("❌ Error deleting application:", deleteError);
      throw deleteError;
    }
    console.log("✅ Application deleted successfully");

    // 2. Delete resume file from storage (if exists)
    if (resumeUrl) {
      // Supabase storage remove() needs the file path (not the full public URL)
      const fileName = resumeUrl.split("/").pop();

      const { error: storageError } = await supabase.storage
        .from("resumes")
        .remove([fileName]);

      if (storageError) {
        console.error("⚠️ Error deleting resume file:", storageError);
        // don’t throw here → allow app delete to succeed even if file cleanup fails
      } else {
        console.log("✅ Resume file deleted:", fileName);
      }
    }

    return { success: true };
  } catch (err) {
    console.error("🔥 withdrawApplication failed:", err);
    throw err;
  }
}
