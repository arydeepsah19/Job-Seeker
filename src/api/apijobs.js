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
        .select(`*, company: companies(name, logo_url),
             application: applications(
                id,
                candidate_id,
                resume,
                status,
                name,
                skills,
                education,
                experience,
                created_at
             )`)
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

export async function addNewJob(token, _, jobData) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("jobs")
        .insert([jobData])
        .select();

    if(error)
    {
        console.error(error);
        throw new Error("Error creating job");
    }

    return data;
}

export async function getSavedJob(token) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("saved_job")
        .select("*, job: jobs(*, company: companies(name,logo_url))");

    if(error)
    {
        console.error(error);
        throw new Error("Error fetching saved jobs");
    }

    return data;
}

export async function getMyJob(token, {recruiter_id}) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("jobs")
        .select("*, company: companies(name,logo_url)")
        .eq("recruiter_id", recruiter_id);

    if(error)
    {
        console.error(error);
        throw new Error("Error fetching my jobs");
    }

    return data;
}

export async function deleteMyJob(token, {job_id}) {
    const supabase = await  supabaseClient(token);

    const {data, error} = await supabase
        .from("jobs")
        .delete()
        .eq("id", job_id)
        .select();

    if(error)
    {
        console.error(error);
        throw new Error("Error Deleting my jobs");
    }

    return data;
}