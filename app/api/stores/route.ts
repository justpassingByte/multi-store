import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const POST = async (req: Request) => {
  try {
    // Get the authenticated user
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Parse the request body
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Store Name is Missing", { status: 400 });
    }

    const storeData = {
      name,
      userId,
      createdAt: serverTimestamp(),
    };

    // Add data to Firestore and retrieve its reference ID
    const storeRef = await addDoc(collection(db, "stores"), storeData);
    const id = storeRef.id;

    // Update the document with the ID and updatedAt field
    await updateDoc(doc(db, "stores", id), {
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...storeData });
  } catch (error) {
    console.log(`STORE_POST: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
