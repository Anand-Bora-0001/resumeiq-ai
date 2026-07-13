"use client";

import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex justify-center md:justify-start">
        <UserProfile
          appearance={{
            elements: {
              card: "bg-transparent shadow-none w-full max-w-full p-0",
              navbar: "hidden",
              pageScrollBox: "p-0",
              profileSection__profile: "hidden",
              badge: "hidden",
            }
          }}
        />
      </div>
    </div>
  );
}
