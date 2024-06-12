
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: false, 
    unique: true 
},
  card: { 
    type: Number, 
    required: false, 
    unique: true 
},
  muduleId: { 
    type: String, 
    required: false, 
    unique: true 
},
  // Add other fields as needed
});

export default mongoose.model("Student", studentSchema);