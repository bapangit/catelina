import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const ProfilePage = async()=>{
  const session = await getServerSession(authOptions);
  console.log("profile",session);
  
  return <div>
    <span>Name : {session?.user?.name}</span>
    <span></span>
  </div>
}

export default ProfilePage
