import supabaseClient from "../utils/supabase";


export async function getJobs(token, {location, company_id,searchQuery}) {
    const supabase = await  supabaseClient(token);

    let query = supabase.from("jobs").select("*, company: companies(name,logo_url), saved: saved_job(id)");

    if(location)
    {
        query = query.eq("location", location);
    }
    if(company_id)
    {
        query = query.eq("company_id", company_id);
    }
    if(searchQuery)
    {
        query = query.ilike("title", `%${searchQuery}%`);
    }
    const { data, error } = await query;

    if(error){
        console.log("Error fetching jobs:",error);
        return null;
    }

    return data;
}

export async function saveJob(token, { alreadySaved }, saveData) {
    const supabase = await  supabaseClient(token);

   if(alreadySaved)
   {
        const {data, error:deleteError} = await supabase
            .from("saved_job")
            .delete()
            .eq("job_id", saveData.job_id);

        if(deleteError)
        {
            console.log("Error deleting saved job:", deleteError);
            return data;
        }

        return data;
   }
   else
   {
        const {data, error: insertError} = await supabase
            .from("saved_job")
            .insert([saveData])
            .select();

        if(insertError)
        {
            console.log("Error fetching saved job:", insertError);
            return data;
        }

        return data;
   }
}

export async function getSingleJob(token, {job_id}) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("jobs")
        .select("*, company: companies(name, logo_url), application: applications(*)")
        .eq("id", job_id)
        .single();

    if(error)
    {
        console.log("Error Fetching job: ", error);
        return null;
    }

    return data;
}

export async function updateHiringStatus(token, {job_id}, isOpen) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("jobs")
        .update({isOpen})
        .eq("id", job_id)
        .select();

    if(error)
    {
        console.log("Error Updating job: ", error);
        return null;
    }

    return data;
}