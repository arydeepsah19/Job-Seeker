import { Link, useSearchParams} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { SignedIn, SignedOut, UserButton, SignIn, useUser} from "@clerk/clerk-react"
import { BriefcaseBusiness, PenBox, Heart} from "lucide-react"
import { useState, useEffect} from "react"

const Header = () => {

  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const {user} = useUser();

  useEffect(()=>{
    if(search.get("sign-in")){
      setShowSignIn(true)
    }
  },[search])

  const handleOverlayClick = (e) =>{
    if(e.target === e.currentTarget){
      setShowSignIn(false);
      setSearch({})
    }
  }
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to="/">
          <img src="/log1.png" alt="logo" className="h-30" />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button variant="outline" onClick={()=> setShowSignIn(true)}>Login</Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to='/post-job'>
              <Button variant="destructive" className="rounded-full">
                <PenBox size={20} className="mr-2" />Post a Job
              </Button>
            </Link> 
            )}
            <UserButton appearance={{
              elements: {
                avatarBox: {width: '32px',height: '32px'},
                avatarImage: 'h-full w-full object-cover object-center',
              }
            }}>

              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Job"
                  labelIcon = {<BriefcaseBusiness size={15}/>}
                  href="/my-job" 
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon = {<Heart size={15}/>}
                  href="/saved-jobs" 
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={handleOverlayClick}> 
          <SignIn 
            signUpForceRedirectUrl="/onboarding"
            fallbackForceRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  )
}

export default Header;

