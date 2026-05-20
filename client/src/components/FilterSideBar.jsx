import {
  useState,
} from "react";

import {
  Slider,
} from "@/components/ui/slider";

import {
  Input,
} from "@/components/ui/input";

import {
  Checkbox,
} from "@/components/ui/checkbox";

import {
  ScrollArea,
} from "@/components/ui/scroll-area";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
} from "lucide-react";


function FilterSidebar({

  categories,

  filters,

  setFilters,

}) {

  // =====================================
  // SEARCH CATEGORY
  // =====================================

  const [
    categorySearch,
    setCategorySearch,
  ] = useState("");


  // =====================================
  // FILTERED CATEGORIES
  // =====================================

  const filteredCategories =
    categories.filter(
      (category) =>
        category.name
          .toLowerCase()
          .includes(
            categorySearch.toLowerCase()
          )
    );


  return (

    /* CHANGED: Swapped flat bg-white for a soft slate backdrop, darkened outer border, and enhanced shadows */
    <div className="bg-slate-50/90 backdrop-blur-sm p-5 rounded-2xl shadow-md border border-slate-300 sticky top-24">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">

        {/* CHANGED: Boosted header text to absolute dark slate for heavy contrast */}
        <h2 className="text-2xl font-bold text-slate-900">
          Filters
        </h2>

        <button
          onClick={() =>
            setFilters({
              page: 1,
              limit: 12,
              search: "",
              category: "",
              maxPrice: 5000,
              sort: "newest",
              inStock: false,
            })
          }
          /* CHANGED: Made reset button darker slate and gave it a high-contrast indigo hover state */
          className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          Reset
        </button>

      </div>


      {/* SEARCH */}

      <div className="mb-8">

        {/* CHANGED: Darkened label contrast */}
        <h3 className="font-semibold text-slate-900 mb-3">
          Search
        </h3>

        <div className="relative">

          {/* CHANGED: Darkened icon color slightly to make it legible */}
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />

          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
            /* CHANGED: Forced bright white background input against the soft gray sidebar, crisp border, dark text */
            className="pl-9 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
          />

        </div>

      </div>


      {/* CATEGORIES */}

      <div className="mb-8">

        {/* CHANGED: Darkened label contrast */}
        <h3 className="font-semibold text-slate-900 mb-4">
          Categories
        </h3>


        {/* CATEGORY SEARCH */}

        <Input
          placeholder="Search categories..."
          value={categorySearch}
          onChange={(e) =>
            setCategorySearch(
              e.target.value
            )
          }
          /* CHANGED: White background input, sharp slate boundary, dark inner text */
          className="mb-4 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-indigo-500"
        />


        {/* SCROLLABLE AREA */}

        {/* CHANGED: Framed the categories scroll window onto a crisp, solid white panel layer */}
        <ScrollArea className="h-52 pr-3 bg-white border border-slate-200 rounded-xl p-3">

          <div className="space-y-3">

            {filteredCategories.map(
              (category) => {
                const isChecked = filters.category === category.name;
                return (
                  <label
                    key={category._id}
                    /* CHANGED: Added dynamic highlighted background color panel when the option is selected */
                    className={`flex items-center gap-3 p-1.5 rounded-lg cursor-pointer transition-colors ${
                      isChecked ? "bg-indigo-50" : "hover:bg-slate-50"
                    }`}
                  >

                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          category:
                            prev.category ===
                            category.name
                              ? ""
                              : category.name,
                          page: 1,
                        }))
                      }
                      /* CHANGED: Made unselected state border darker slate, filled checked state with brand indigo */
                      className="border-slate-400 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                    />

                    {/* CHANGED: Text turns dark blue/indigo and bold if active, deep slate if inactive */}
                    <span className={`capitalize text-sm font-medium ${
                      isChecked ? "text-indigo-900 font-bold" : "text-slate-700"
                    }`}>
                      {category.name}
                    </span>

                  </label>
                );
              }
            )}

          </div>

        </ScrollArea>

      </div>


      {/* PRICE */}

      {/* CHANGED: Encased the slider section in its own distinctive white panel to break up contrast */}
      <div className="mb-8 bg-white p-3.5 rounded-xl border border-slate-200">

        <div className="flex items-center justify-between mb-4">

          {/* CHANGED: Darkened label contrast */}
          <h3 className="font-semibold text-slate-900">
            Max Price
          </h3>

          {/* CHANGED: Turned values into a clear high-contrast display badge */}
          <span className="text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md">
            $
            {filters.maxPrice}
          </span>

        </div>

        <Slider
          value={[filters.maxPrice]}
          max={5000}
          step={100}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              maxPrice: value[0],
              page: 1,
            }))
          }
          /* CHANGED: Injected indigo color keys directly into shadcn style tokens */
          className="py-1 [&_[role=slider]]:bg-indigo-600 [&_[role=slider]]:border-indigo-600"
        />

      </div>


      {/* SORT */}

      <div className="mb-8">

        {/* CHANGED: Darkened label contrast */}
        <h3 className="font-semibold text-slate-900 mb-4">
          Sort By
        </h3>

        <Select
          value={filters.sort}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              sort: value,
              page: 1,
            }))
          }
        >

          {/* CHANGED: Re-styled native trigger values to be deep text on solid background */}
          <SelectTrigger className="bg-white border-slate-300 text-slate-900 font-medium focus:ring-indigo-500">

            <SelectValue />

          </SelectTrigger>

          {/* CHANGED: Hardened dropdown contents definitions */}
          <SelectContent className="bg-white border-slate-200 text-slate-900 font-medium">

            <SelectItem value="newest">
              Newest
            </SelectItem>

            <SelectItem value="price_asc">
              Price: Low to High
            </SelectItem>

            <SelectItem value="price_desc">
              Price: High to Low
            </SelectItem>

            <SelectItem value="rating">
              Top Rated
            </SelectItem>

          </SelectContent>

        </Select>

      </div>


      {/* STOCK */}

      {/* CHANGED: Added a separate divider line at the footer layout block */}
      <div className="pt-2 border-t border-slate-200">

        <label className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group">

          <Checkbox
            checked={filters.inStock}
            onCheckedChange={(
              checked
            ) =>
              setFilters((prev) => ({
                ...prev,
                inStock:
                  checked,
                page: 1,
              }))
            }
            /* CHANGED: Made check track clearer, popping indigo when selected */
            className="border-slate-400 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
          />

          {/* CHANGED: Darkened stock filter text context and added a hover jump state */}
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
            In Stock Only
          </span>

        </label>

      </div>

    </div>
  );
}

export default FilterSidebar;