import { Link } from "react-router-dom";

function ItemCard({ item }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      
      {/* Image */}
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
          No Image
        </div>
      )}

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {item.title}
          </h3>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              item.type === "lost"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {item.type.toUpperCase()}
          </span>
        </div>

        <p className="mb-2 text-sm text-gray-500">
          {item.category}
        </p>

        <p className="mb-2 text-sm text-gray-600">
          📍 {item.location}
        </p>

        <p className="mb-4 text-sm text-gray-600">
          Status:{" "}
          <span className="font-medium">
            {item.status}
          </span>
        </p>

        <Link
          to={`/items/${item._id}`}
          className="block rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ItemCard;