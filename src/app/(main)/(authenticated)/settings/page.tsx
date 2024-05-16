"use client";
import Form from "@/components/domain";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">Settings</h3>
        <div className="flex flex-col space-y-6">
          <Form
            title="Subdomain"
            description="The subdomain for your site."
            helpText="Please use 32 characters maximum."
            inputAttrs={{
              name: "subdomain",
              type: "text",
              defaultValue: "",
              placeholder: "subdomain",
              maxLength: 32,
            }}
            handleSubmit={() => {}}
          />
          <Form
            title="Custom Domain"
            description="The custom domain for your site."
            helpText="Please enter a valid domain."
            inputAttrs={{
              name: "customDomain",
              type: "text",
              defaultValue: "",
              placeholder: "yourdomain.com",
              maxLength: 64,
              pattern: "^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$",
            }}
            handleSubmit={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
