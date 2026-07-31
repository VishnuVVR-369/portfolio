import { redirect } from "next/navigation";

const RESUME_PDF_PATH = "/resume.pdf";

export function GET() {
  redirect(RESUME_PDF_PATH);
}

export function HEAD() {
  redirect(RESUME_PDF_PATH);
}
