// components
import { Markdown } from "@/components/Markdown";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "./ui/separator";

// 3rd party
import TurndownService from "turndown";

export function JobDescription({ description }: { description: string }) {
  const turndown = new TurndownService();
  const markdown = turndown.turndown(description);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Job Description</CardTitle>
        <CardDescription>
          A detailed overview of the job and what it involves.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <Markdown>{markdown}</Markdown>
      </CardContent>
    </Card>
  );
}
