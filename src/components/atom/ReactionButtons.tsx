import { Button } from "flowbite-react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

export function ReactionButtons({
    session,
    isLoadingReactions,
    reactionData,
    handleReaction,
}: any) {
    return (
        <div className="flex items-center space-x-8">
            <Button
                size="xs"
                outline
                gradientDuoTone="greenToBlue"
                isProcessing={isLoadingReactions}
                onClick={() => handleReaction("like")}
                disabled={!session || isLoadingReactions}
            >
                <FaThumbsUp className="mr-4 h-5 w-5" />
                <span className="text-md">{reactionData?.likes || 0}</span>
            </Button>
            <Button
                size="xs"
                outline
                gradientDuoTone="greenToBlue"
                isProcessing={isLoadingReactions}
                onClick={() => handleReaction("dislike")}
                disabled={!session || isLoadingReactions}
            >

                <FaThumbsDown className="mr-4 h-5 w-5" />
                <span className="text-md">{reactionData?.dislikes || 0}</span>
            </Button>
        </div>
    );
}
