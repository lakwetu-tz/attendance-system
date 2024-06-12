
import { Router } from "express";
import { handleCreateMajor, handleDeleteMajor, handleGetAllMajors, handleUpdateMajor } from "../controllers/majorController";

const router = Router();

router.get("/", (req, res) => {
    const routes = [
        {
            path: "/getAll",
            method: "GET",
            description: "Access all create major data"
        },
        {
            path: "/getOne/:id",
            description: "Access a single major data"
        },
        {
            path: "/create",
            description: "Create  a new major data"
        },
        {
            path: "/update/:id",
            description: "Update a major data"
        },
        {
            path: "/delete/:id",
            description: "Delete a major data"
        }
    ];
    res.json(routes);

  res.send({ status: "Ok", message: "Access Major API", routes});
});

router.post("/create", handleCreateMajor );

router.get("/getAll", handleGetAllMajors);

router.put("/update/:id", handleUpdateMajor);

router.delete("/delete/:id", handleDeleteMajor);

export default router;