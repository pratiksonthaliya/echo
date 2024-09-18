import { useUserBookmarks } from "@/hooks/bookmark";

export default function GetBookmarks(userId: string){
    const { data } = useUserBookmarks(userId);
    return data;
}