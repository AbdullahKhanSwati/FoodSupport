import Routine from "../Models/Routine.js";

// ================= CREATE ROUTINE =================
export const createRoutine = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, steps } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!name) {
      return res.status(400).json({ success: false, message: "Routine name is required" });
    }

    if (!steps || steps.length === 0) {
      return res.status(400).json({ success: false, message: "At least one step is required" });
    }

    if (steps.length > 5) {
      return res.status(400).json({ success: false, message: "Maximum 5 steps allowed" });
    }

    const routine = await Routine.create({
      userId,
      name,
      steps,
    });

    return res.status(201).json({
      success: true,
      message: "Routine created successfully",
      data: routine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating routine",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= GET ALL ROUTINES =================
export const getRoutines = async (req, res) => {
  try {
    const userId = req.user?.id;

    const routines = await Routine.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Routines fetched successfully",
      data: routines,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching routines",
    });
  }
};

// ================= GET SINGLE ROUTINE =================
export const getRoutineById = async (req, res) => {
  try {
    const { id } = req.params;

    const routine = await Routine.findById(id);

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: "Routine not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: routine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching routine",
    });
  }
};

// ================= UPDATE ROUTINE NAME =================
export const updateRoutine = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name } = req.body;

    const routine = await Routine.findById(id);

    if (!routine) {
      return res.status(404).json({ success: false, message: "Routine not found" });
    }

    if (routine.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    routine.name = name || routine.name;
    await routine.save();

    return res.status(200).json({
      success: true,
      message: "Routine updated successfully",
      data: routine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating routine",
    });
  }
};

// ================= ADD STEP =================
export const addStep = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { stepText, timer } = req.body;

    const routine = await Routine.findById(id);

    if (!routine) {
      return res.status(404).json({ success: false, message: "Routine not found" });
    }

    if (routine.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    if (routine.steps.length >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 steps allowed",
      });
    }

    routine.steps.push({
      stepText,
      timer,
      order: routine.steps.length + 1,
    });

    await routine.save();

    return res.status(200).json({
      success: true,
      message: "Step added successfully",
      data: routine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding step",
    });
  }
};

// ================= UPDATE STEP =================
export const updateStep = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id, stepIndex } = req.params;
    const { stepText, timer } = req.body;

    const routine = await Routine.findById(id);

    if (!routine) {
      return res.status(404).json({ success: false, message: "Routine not found" });
    }

    if (routine.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    if (!routine.steps[stepIndex]) {
      return res.status(404).json({ success: false, message: "Step not found" });
    }

    routine.steps[stepIndex].stepText = stepText || routine.steps[stepIndex].stepText;
    routine.steps[stepIndex].timer = timer || routine.steps[stepIndex].timer;

    await routine.save();

    return res.status(200).json({
      success: true,
      message: "Step updated successfully",
      data: routine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating step",
    });
  }
};

// ================= DELETE STEP =================
export const deleteStep = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id, stepIndex } = req.params;

    const routine = await Routine.findById(id);

    if (!routine) {
      return res.status(404).json({ success: false, message: "Routine not found" });
    }

    if (routine.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }

    if (!routine.steps[stepIndex]) {
      return res.status(404).json({ success: false, message: "Step not found" });
    }

    routine.steps.splice(stepIndex, 1);

    await routine.save();

    return res.status(200).json({
      success: true,
      message: "Step deleted successfully",
      data: routine,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting step",
    });
  }
};

// ================= DELETE ROUTINE =================
export const deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;

    const routine = await Routine.findById(id);

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: "Routine not found",
      });
    }

    await routine.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Routine deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting routine",
    });
  }
};