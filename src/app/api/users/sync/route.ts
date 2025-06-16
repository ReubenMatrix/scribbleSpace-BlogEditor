// app/api/users/sync/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
        updatedAt: new Date(),
      },
      create: {
        id: user.id,
        email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
      },
    });

    return NextResponse.json({ success: true, user: dbUser });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}