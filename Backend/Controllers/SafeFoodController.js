import SafeFood from "../Models/SafeFood.js";

// ================= CREATE SAFE FOOD =================
export const createSafeFood = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, description, type, temperature, image } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!name || !type || !temperature) {
      return res.status(400).json({
        success: false,
        message: "Name, type and temperature are required",
      });
    }

    // Check duplicate
    const existing = await SafeFood.findOne({ userId, name });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Food already exists in your list",
      });
    }

    const safeFood = await SafeFood.create({
      userId,
      name,
      description,
      type,
      temperature,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Safe food added successfully",
      data: safeFood,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating safe food",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= GET ALL SAFE FOODS =================
export const getSafeFoods = async (req, res) => {
  try {
    const userId = req.user?.id;

    const { type, temperature, search, favorite } = req.query;

    let query = { userId };

    // Filters
    if (type) query.type = type;
    if (temperature) query.temperature = temperature;
    if (favorite) query.isFavorite = favorite === "true";

    // Search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const foods = await SafeFood.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Safe foods fetched successfully",
      data: foods,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching safe foods",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= GET SINGLE SAFE FOOD =================
export const getSafeFoodById = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await SafeFood.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Safe food not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Safe food fetched successfully",
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching safe food",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= UPDATE SAFE FOOD =================
export const updateSafeFood = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const food = await SafeFood.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Safe food not found",
      });
    }

    if (food.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to update this food",
      });
    }

    const updatedFood = await SafeFood.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Safe food updated successfully",
      data: updatedFood,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating safe food",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= DELETE SAFE FOOD =================
export const deleteSafeFood = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const food = await SafeFood.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Safe food not found",
      });
    }

    if (food.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to delete this food",
      });
    }

    await food.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Safe food deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting safe food",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ================= TOGGLE FAVORITE =================
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const food = await SafeFood.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Safe food not found",
      });
    }

    if (food.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    food.isFavorite = !food.isFavorite;
    await food.save();

    return res.status(200).json({
      success: true,
      message: "Favorite status updated",
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating favorite",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};