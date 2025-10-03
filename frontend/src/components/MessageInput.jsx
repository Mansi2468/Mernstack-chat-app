import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X, Image, Send, Smile } from "lucide-react";
import { toast } from "react-hot-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const MessageInput = () => {
const [text, setText] = useState("");
const [imagePreview, setImagePreview] = useState(null);
const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const fileInput = useRef(null);
const { sendMessage} = useChatStore();

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
        setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
};
const removeImage = () => {
    setImagePreview(null);
    if (fileInput.current) {
        fileInput.current.value = null;
    }
};
const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
        await sendMessage({
            text: text.trim(),
            image: imagePreview,
        });
        setText("");
        setImagePreview(null);
        if (fileInput.current) {
            fileInput.current.value = "";
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
};

const handleEmojiSelect = (emoji) => {
    setText((prevText) => prevText + emoji.native);
    setShowEmojiPicker(false);
};


  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInput}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className="hidden sm:flex btn btn-circle text-zinc-400"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={20} />
          </button>

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInput.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>

      {showEmojiPicker && (
        <div className="mt-2">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>

  )
}

export default MessageInput