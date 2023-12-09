import { Aggregate, DashboardData, Params } from "@/app/dashboard/page";
import React from "react";

type DataTableProps = {
  data: DashboardData[];
  aggregate: Aggregate;
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  handleLimitChange: (selectedLimit: string) => void;
  loading: boolean;
};
const DataTable = ({
  data,
  aggregate,
  params,
  setParams,
  handleLimitChange,
  loading,
}: DataTableProps) => {
  return (
    <>
      {loading ? (
        <LoadingTableSkeleton />
      ) : data.length === 0 ? (
        <NoData />
      ) : (
        <div className="w-full overflow-hidden flex flex-col gap-2">
          <div className="flex justify-between items-center w-full gap-2">
            <span className="text-gray-500">
              Number Of Requests:{" "}
              <span className="text-white">{aggregate?.numberOfRequests}</span>
            </span>
            <span className="text-gray-500">
              Average Latency:{" "}
              <span className="text-white">{aggregate?.averageLatency}</span>
            </span>
            <span className="text-gray-500">
              p95 Latency:{" "}
              <span className="text-white">{aggregate?.p95Latency}</span>
            </span>
            <span className="text-gray-500">
              Total Failures:{" "}
              <span className="text-white">{aggregate?.totalFailures}</span>
            </span>
            <span className="text-gray-500">
              Input Tokens Per Second:{" "}
              <span className="text-white">
                {aggregate?.inputTokensPerSecond}
              </span>
            </span>
            <span className="text-gray-500">
              Total Input Tokens:{" "}
              <span className="text-white">{aggregate?.totalInputTokens}</span>
            </span>
            <span className="text-gray-500">
              Total Output Tokens:{" "}
              <span className="text-white">{aggregate?.totalOutputTokens}</span>
            </span>
          </div>
          <div className="w-full overflow-x-auto rounded-lg">
            <table className="w-full whitespace-no-wrap shadow-md">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-300">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Response</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Prompt Tokens</th>
                  <th className="px-4 py-3">Completion Tokens</th>
                  <th className="px-4 py-3">Total Tokens</th>
                  <th className="px-4 py-3">Latency</th>
                  <th className="px-4 py-3">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-slate-100 divide-y">
                {data.map((item, i) => (
                  <tr key={i} className="text-gray-700">
                    <td className="px-4 py-3">{item.user}</td>
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3">
                      {item.request.slice(0, 15)}...
                    </td>
                    <td className="px-4 py-3">
                      {item.response.slice(0, 15)}...
                    </td>
                    <td className="px-4 py-3">{item.model}</td>
                    <td className="px-4 py-3">{item.prompt_tokens}</td>
                    <td className="px-4 py-3">{item.completion_tokens}</td>
                    <td className="px-4 py-3">{item.total_tokens}</td>
                    <td className="px-4 py-3">{item.latency}</td>
                    <td className="px-4 py-3">{item.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center gap-4 text-white">
            {params.page > 1 && (
              <button
                className="border border-gray-300 rounded-md p-2 w-40 hover:bg-white hover:text-black ease-in-out duration-300 transition-colors"
                onClick={() => setParams({ ...params, page: params.page - 1 })}
              >
                Previous
              </button>
            )}
            {params.page * parseInt(params.limit) <
              parseInt(aggregate?.numberOfRequests) && (
              <button
                className="border border-gray-300 rounded-md p-2 w-40 hover:bg-white hover:text-black ease-in-out duration-300 transition-colors"
                onClick={() => setParams({ ...params, page: params.page + 1 })}
              >
                Next
              </button>
            )}
            <div className="flex justify-between items-center gap-2">
              <label htmlFor="limit">Limit: </label>
              <select
                id="limit"
                value={params.limit}
                onChange={(e) => handleLimitChange(e.target.value)}
                className="p-2 rounded-md border-none outline-none bg-slate-800 w-40"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="20">50</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const LoadingTableSkeleton = () => {
  return (
    <div className="w-full overflow-hidden flex flex-col gap-2">
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full whitespace-no-wrap shadow-md">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-300">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Request</th>
              <th className="px-4 py-3">Response</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Prompt Tokens</th>
              <th className="px-4 py-3">Completion Tokens</th>
              <th className="px-4 py-3">Total Tokens</th>
              <th className="px-4 py-3">Latency</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-slate-100 divide-y">
            {[...Array(5)].map((item, i) => (
              <tr key={i} className="text-gray-700">
                <td className="px-4 py-3 animate-pulse">-</td>
                <td className="px-4 py-3 animate-pulse">-</td>
                <td className="px-4 py-3 animate-pulse">-</td>
                <td className="px-4 py-3 animate-pulse">-</td>
                <td className="px-4 py-3 animate-pulse">-</td>
                <td className="px-4 py-3 animate-pulse">-</td>
                <td className="px-4 py-3 animate-pulse">-</td>
                <td className="px-4 py-3 animate-pulse">-</td>
                <td className="px-4 py-3 animate-pulse">-</td>
                <td className="px-4 py-3 animate-pulse">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Show a div with a message if there is no data
const NoData = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold text-gray-700">
        No data available for the selected filters.
      </h2>
      <p className="text-gray-500 text-center">
        Try changing the filters or <br /> start a conversation with our
        assistant.
      </p>
    </div>
  );
};

export default DataTable;
