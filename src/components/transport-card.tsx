import { Button } from "./ui/button";
import { Map, ArrowDown } from "lucide-react";
import Link from "next/link";

interface TransportCardProps {
  description: string;
  link: string;
}

export function TransportCard({ description, link }: TransportCardProps) {
  return (
    <div className="my-6 flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <ArrowDown className="h-6 w-6 text-primary/50" />
        <p className="font-semibold">{description}</p>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary">
            <Link href={link} target="_blank" rel="noopener noreferrer">
                <Map className="h-4 w-4" />
                View Route
            </Link>
        </Button>
    </div>
  );
}
