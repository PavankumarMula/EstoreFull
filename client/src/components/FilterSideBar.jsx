import { Slider } from "@/components/ui/slider";

function FilterSidebar({ categories }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-24">

      <h2 className="text-2xl font-bold mb-6">
        Filters
      </h2>

      {/* Categories */}
      <div className="mb-8">

        <h3 className="font-semibold text-slate-800 mb-4">
          Categories
        </h3>

        <div className="space-y-3">

          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input type="checkbox" />

              <span className="capitalize text-slate-600">
                {category}
              </span>
            </label>
          ))}

        </div>

      </div>

      {/* Price Range */}
      <div className="mb-8">

        <h3 className="font-semibold text-slate-800 mb-4">
          Price Range
        </h3>

       <div className="px-1">

  <Slider
    defaultValue={[100]}
    max={500}
    step={10}
  />

  <div className="flex justify-between mt-4 text-sm text-slate-500">
    <span>$0</span>
    <span>$100</span>
    <span>$500</span>
  </div>

</div>

      </div>

      {/* Brand */}
      <div className="mb-8">

        <h3 className="font-semibold text-slate-800 mb-4">
          Brands
        </h3>

        <div className="space-y-3">

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span>Apple</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span>Samsung</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span>Nike</span>
          </label>

        </div>

      </div>

      {/* Availability */}
      <div>

        <h3 className="font-semibold text-slate-800 mb-4">
          Availability
        </h3>

        <label className="flex items-center gap-3">
          <input type="checkbox" />
          <span>In Stock</span>
        </label>

      </div>

    </div>
  );
}

export default FilterSidebar;