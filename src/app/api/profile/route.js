import { connect } from "@/dbConfig/dbConfig";
import Result from "@/models/resultModel";
import { NextResponse } from "next/server";

// Fetch user quiz history
export async function GET(req) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const results = await Result.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz history" },
      { status: 500 }
    );
  }
}

// Save quiz result
export async function POST(req) {
  try {
    await connect();
    const { topic, score, totalQuestions, userId } = await req.json();

    // Validation
    if (
      !topic ||
      typeof topic !== "string" ||
      typeof score !== "number" ||
      typeof totalQuestions !== "number" ||
      score < 0 ||
      totalQuestions <= 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid input data" },
        { status: 400 }
      );
    }

    const newResult = new Result({
      topic,
      score,
      totalQuestions,
      userId: userId || null,
      createdAt: new Date()
    });

    await newResult.save();

    return NextResponse.json(
      { message: "Quiz result saved successfully", result: newResult },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json(
      { error: "Failed to save quiz result" },
      { status: 500 }
    );
  }
}
