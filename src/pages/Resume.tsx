import { Button } from "@/components/ui/button";

const RESUME_PATH = "/assets/Jay_Buensuceso_Resume_2025.pdf";

export default function Resume() {
  return (
    <div className="container mx-auto mt-8 px-4 max-w-6xl relative pb-8">
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-3">Resume</h1>
        <p className="text-muted-foreground mb-4">
          View the latest PDF version of my resume below.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <a href={RESUME_PATH} target="_blank" rel="noreferrer">
              Open in New Tab
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href={RESUME_PATH} download>
              Download PDF
            </a>
          </Button>
        </div>
      </section>

      <section>
        <object
          data={RESUME_PATH}
          type="application/pdf"
          width="100%"
          className="h-[75vh] rounded-md border bg-background"
        >
          <div className="space-y-2 p-4 border rounded-md">
            <p className="text-sm text-muted-foreground">
              Your browser does not support inline PDF viewing.
            </p>
            <a href={RESUME_PATH} target="_blank" rel="noreferrer" className="underline">
              Open the resume PDF
            </a>
          </div>
        </object>
      </section>
    </div>
  );
}