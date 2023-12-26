import express from 'express'
import cors from 'cors'
import * as RecipeAPI  from './recipe-api'
import {PrismaClient} from '@prisma/client'

const app = express()
const prismaClient = new PrismaClient()
app.use(express.json())
app.use(cors())

app.get("/api/recipes/search",async (req:any, res: any) => {
    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string)
    const result = await RecipeAPI.searchRecipes(searchTerm, page);

    return res.json(result)
})

app.get("/api/recipes/:recipeId/summary",async (req,res) => {
    const recipeId = req.params.recipeId
    const results = await RecipeAPI.getRecipeSummary(recipeId)

    return res.json(results)
})

app.post("/api/recipes/favorite", async (req, res) => {
    const recipeId = req.body.recipeId;
  
    try {
      const favouriteRecipe = await prismaClient.favoriteRecipes.create({
        data: {
          recipeId: recipeId,
        },
      });
      return res.status(201).json(favouriteRecipe);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Oops, something went wrong" });
    }
  });

  app.get("/api/recipes/favorite", async (req, res) => {
    try {
      const recipes = await prismaClient.favoriteRecipes.findMany();
      const recipeIds = recipes.map((recipe) => recipe.recipeId.toString());
  
      const favourites = await RecipeAPI.getFavouriteRecipesByIDs(recipeIds);
  
      return res.json(favourites);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Oops, something went wrong" });
    }
  });

  app.delete("/api/recipes/favorite", async (req, res) => {
    const recipeId = req.body.recipeId;
  
    try {
      await prismaClient.favoriteRecipes.delete({
        where: {
          recipeId: recipeId,
        },
      });
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Oops, something went wrong" });
    }
  });


app.listen(3000,()=>{
    console.log("server running on port 3000")
})
