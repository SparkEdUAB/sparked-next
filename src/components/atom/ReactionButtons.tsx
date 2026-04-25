import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
                size="sm"
                variant="outline"
                onClick={() => handleReaction("like")}
                disabled={!session || isLoadingReactions}
            >
                {isLoadingReactions ? (
                    <Loader2 className="mr-4 h-5 w-5 animate-spin text-primary" />
                ) : (
                    <FaThumbsUp className="mr-4 h-5 w-5" />
                )}
                <span className="text-md">{reactionData?.likes || 0}</span>
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => handleReaction("dislike")}
                disabled={!session || isLoadingReactions}
            >
                {isLoadingReactions ? (
                    <Loader2 className="mr-4 h-5 w-5 animate-spin text-primary" />
                ) : (
                    <FaThumbsDown className="mr-4 h-5 w-5" />
                )}
                <span className="text-md">{reactionData?.dislikes || 0}</span>
            </Button>
        </div>
    );
}
