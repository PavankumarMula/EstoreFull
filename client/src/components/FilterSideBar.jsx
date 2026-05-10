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

    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-24">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold">
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
          className="text-sm text-slate-500 hover:text-black"
        >
          Reset
        </button>

      </div>


      {/* SEARCH */}

      <div className="mb-8">

        <h3 className="font-semibold mb-3">
          Search
        </h3>

        <div className="relative">

          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

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
            className="pl-9"
          />

        </div>

      </div>


      {/* CATEGORIES */}

      <div className="mb-8">

        <h3 className="font-semibold mb-4">
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
          className="mb-4"
        />


        {/* SCROLLABLE AREA */}

        <ScrollArea className="h-52 pr-3">

          <div className="space-y-3">

            {filteredCategories.map(
              (category) => (

                <label
                  key={category._id}
                  className="flex items-center gap-3 cursor-pointer"
                >

                  <Checkbox
                    checked={
                      filters.category ===
                      category.name
                    }
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
                  />

                  <span className="capitalize text-sm text-slate-700">

                    {category.name}

                  </span>

                </label>
              )
            )}

          </div>

        </ScrollArea>

      </div>


      {/* PRICE */}

      <div className="mb-8">

        <div className="flex items-center justify-between mb-4">

          <h3 className="font-semibold">
            Max Price
          </h3>

          <span className="text-sm text-slate-500">

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
        />

      </div>


      {/* SORT */}

      <div className="mb-8">

        <h3 className="font-semibold mb-4">
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

          <SelectTrigger>

            <SelectValue />

          </SelectTrigger>

          <SelectContent>

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

      <div>

        <label className="flex items-center gap-3 cursor-pointer">

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
          />

          <span className="text-sm">
            In Stock Only
          </span>

        </label>

      </div>

    </div>
  );
}

export default FilterSidebar;