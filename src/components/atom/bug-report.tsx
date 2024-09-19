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
import { bugReportSchema } from "@/lib/validators/bug-report-schema";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BugReportType } from "@/lib/types";

//end solison bol bas zod validation deer ni solih estoi shuuu
const reasonOptions = [
  { value: "loyalty_program", label: "Issues with loyalty program or rewards" },
  {
    value: "restaurant_info",
    label: "Problems finding or viewing restaurant information",
  },
  { value: "account_issues", label: "Trouble with my account or profile" },
  { value: "app_navigation", label: "Difficulty using or navigating the app" },
  { value: "app_performance", label: "App is slow or unresponsive" },
  { value: "other", label: "Other issue not listed here" },
];

const BugReportButton = () => {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<BugReportType["reason"]>("other");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    const bugReport: BugReportType = {
      deviceModel,
      appVersion,
      osVersion,
      reason,
      description,
      userId,
    };

    try {
      const validatedReport = bugReportSchema.parse(bugReport);
      const response = await submitBugReport(validatedReport);

      if (response.success) {
        toast.success(
          "Thank you for your feedback! We've received your report and will look into it."
        );
        setOpen(false);
        setReason("other");
        setDescription("");
      } else {
        toast.error("Failed to submit bug report. Please try again.");
        throw new Error(
          `Failed to submit bug report` + JSON.stringify(response.error)
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors.map((e) => e.message).join(", "));
      } else {
        console.error("Error submitting bug report:", error);
        setError(
          "We encountered an issue while submitting your report. Please try again later."
        );
      }
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
          <DialogTitle>Help Us Improve</DialogTitle>
          <DialogDescription>
            We&apos;d love to hear about any issues you&apos;re experiencing or
            suggestions you have for our app.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                What&apos;s the issue
              </Label>
              <Select
                value={reason}
                onValueChange={(value: BugReportType["reason"]) =>
                  setReason(value)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select the type of issue" />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Tell us more
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                placeholder="Please provide any additional details that might help us understand and address the issue."
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}s
          <DialogFooter>
            <Button type="submit">Submit Feedback</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BugReportButton;
