import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Trash2, EditIcon } from 'lucide-react'
import { Button } from "./index.js"
import axios from "../utils/axiosInstance"
import errorMessage from "../utils/errorMessage.js"
import { useDispatch } from 'react-redux'
import { logout } from '../store/authSlice.js'
import toast from "react-hot-toast"

const CommentOptions = ({ className, textarea, setAllComment, videoId, currentComment, setComment, isEditing, editingComment }) => {
  const dispatch = useDispatch()

  const editComment = () => {
    textarea.current.focus()
    editingComment(currentComment)
    isEditing(true)
    setComment(currentComment.content)
  }

  const deleteComment = () => {
    axios.delete(`/comment/c/${currentComment._id}`)
            .then((_) => {
                axios.get(`/comment/v/${videoId}`)
                    .then((value) => {
                        setAllComment(value.data.data);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    })
            })
            .catch((error) => {
                if (error.status === 401) {
                    toast.error("You need to login first", {
                        style: { color: "#ffffff", backgroundColor: "#333333" },
                        position: "top-center"
                    })
                    dispatch(logout())
                    navigate("/login")
                }
                console.error(errorMessage(error));
            })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild title='options' className={`absolute right-4 top-0 ${className}`}>
        <div className='flex cursor-pointer px-[15px] py-2 rounded-full transition-colors hover:bg-primary/30 flex-col gap-1 h-max w-max'>
          <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
          <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
          <span className='h-[3px] w-[3px] rounded-full bg-primary'></span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-min">
        <DropdownMenuItem className="py-0 px-1 w-full">
          <Button className="bg-transparent w-max h-min text-primary shadow-none hover:bg-transparent hover:text-primary" onClick={editComment}>
            <EditIcon />Edit
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-0 px-0 w-max">
          <Button className="bg-transparent w-max text-red-600 shadow-none hover:bg-transparent hover:text-red-600" onClick={deleteComment}>
            <Trash2 />Delete
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CommentOptions
