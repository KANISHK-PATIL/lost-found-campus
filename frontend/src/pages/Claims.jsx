import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Claims() {
  const { id } = useParams();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, [id]);

  const fetchClaims = async () => {
    try {
      const response = await api.get(
        `/items/${id}/claims`
      );

      setClaims(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateClaim = async (
    claimId,
    status
  ) => {
    try {
      await api.patch(
        `/claims/${claimId}`,
        { status }
      );

      fetchClaims();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update claim"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-10">
        Loading claims...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        Item Claims
      </h1>

      {claims.length === 0 ? (
        <div className="rounded-lg bg-gray-100 p-8 text-center">
          No claims yet.
        </div>
      ) : (
        <div className="space-y-5">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {claim.claimant?.name}
                </h2>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {claim.status}
                </span>
              </div>

              <p className="mb-5 text-gray-600">
                {claim.message}
              </p>

              {claim.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      updateClaim(
                        claim._id,
                        "approved"
                      )
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-white"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateClaim(
                        claim._id,
                        "rejected"
                      )
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-white"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Claims;