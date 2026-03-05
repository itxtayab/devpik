"use client";

import { useParams } from "next/navigation";
import BlogEditorForm from "@/components/admin/BlogEditorForm";

export default function EditBlogPage() {
    const params = useParams();
    const blogId = params.id as string;

    return <BlogEditorForm blogId={blogId} />;
}
