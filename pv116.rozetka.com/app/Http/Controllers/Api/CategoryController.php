<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class CategoryController extends Controller
{
    public function getList() {
        $data = Categories::all();
        return response()->json($data)
            ->header("Content-Type", "application/json; charset=utf8");
    }

    public function edit($id)
    {
        // Get the category by ID
        $category = Categories::find($id);

        // Check if the category exists
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Return the category data
        return response()->json($category, 200);
    }

    public function create(Request $request) {
        $input = $request->all();
        $image = $request->file("image");
        // create image manager with desired driver
        $manager = new ImageManager(new Driver());
        $imageName=uniqid().".webp";
        $sizes = [50,150,300,600,1200];
        foreach ($sizes as $size) {
            // read image from file system
            $imageSave = $manager->read($image);
            // resize image proportionally to 600px width
            $imageSave->scale(width: $size);
            $path = public_path("upload/".$size."_".$imageName);
            // save modified image in new format
            $imageSave->toWebp()->save($path);
        }
        $input["image"]=$imageName;
        $category = Categories::create($input);
        return response()->json($category,201,
            ['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'], JSON_UNESCAPED_UNICODE);
    }

    public function editElement(Request $request, $id)
    {
        $input = $request->all();
        $category = Categories::findOrFail($id);

        // Handle image upload and update
        if ($request->hasFile('image')) {
            $image = $request->file("image");
            $this->processImage($category, $image);
        }

        // Update other fields
        $category->update($input);

        return response()->json($category, 201);
    }

    private function processImage($category, $image)
    {
        // Create image manager with desired driver
        $manager = new ImageManager(new Driver());
        $imageName = uniqid() . ".webp";
        $sizes = [50, 150, 300, 600, 1200];

        foreach ($sizes as $size) {
            // read image from file system
            $imageSave = $manager->read($image);

            // resize image proportionally to $size width
            $imageSave->scale(width: $size);
            $path = public_path("upload/" . $size . "_" . $imageName);

            // save modified image in new format
            $imageSave->toWebp()->save($path);
        }

        // Delete previous images associated with the category
        $this->deletePreviousImages($category);

        // Update category's image field
        $category->update(['image' => $imageName]);
    }

    private function deletePreviousImages($category)
    {
        $imageSizes = [50, 150, 300, 600, 1200];

        foreach ($imageSizes as $size) {
            $path = public_path("upload/{$size}_{$category->image}");

            if (file_exists($path)) {
                unlink($path);
            }
        }
    }
    public function delete($id)
    {
            $category = Categories::findOrFail($id);

            // Delete images associated with the category, assuming you store images in the "upload" directory
            $imageSizes = [50, 150, 300, 600, 1200];
            foreach ($imageSizes as $size) {
                $path = public_path("upload/{$size}_{$category->image}");
                if (file_exists($path)) {
                    unlink($path);
                }
            }

            // Delete the category
            $category->delete();

            return response()->json($category, 201);
    }

}
