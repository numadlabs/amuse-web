import React, { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BugIcon } from "lucide-react";
import { submitBugReport } from "@/lib/service/mutationHelper";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const BugReportButton = () => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const { data: session } = useSession();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Collect device info
    const deviceModel = navigator.userAgent;
    const appVersion = "1.0.0"; // Replace with your app's version
    const osVersion = navigator.platform;

    const userId = session?.userId;

    if (!userId) {
      toast.error("You need to be logged in to submit a bug report.");
      return;
    }

    try {
      const response = await submitBugReport({
        deviceModel,
        appVersion,
        osVersion,
        reason,
        description,
        userId,
      });

      if (response.success) {
        toast.success("Bug report submitted successfully!");
        setOpen(false);
        setReason("");
        setDescription("");
      } else {
        toast.error("Failed to submit bug report. Please try again.");
        throw new Error(
          `Failed to submit bug report` + JSON.stringify(response.error)
        );
      }
    } catch (error) {
      console.error("Error submitting bug report:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full"
        >
          <BugIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
          <DialogDescription>
            Please provide details about the bug you&apos;ve encountered.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BugReportButton;
