const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    precioCompra: {
      type: Number,
      trim: true,
      required: true,
    },
    cantidadComprada:{
      type: Number,
      trim: true,
      required: true,
    },
    cantidadStock:{
      type: Number,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    tipoProducto: {
      type: ObjectId,
      ref: "TipoProducto",
    },
    imagen: {
        type: String,
        trim: true,
        required: true,
        text: true,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Producto", productSchema);