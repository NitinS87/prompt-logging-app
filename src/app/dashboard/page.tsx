"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type FilterModel = {
  user: string;
  status: string;
  model: string;
  latency: number;
  days: string;
};

type DashboardData = {
  user: string;
  status: string;
  request: string;
  response: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  latency: number;
  created_at: string;
};

type Aggregate = {
  numberOfRequests: string;
  averageLatency: number;
  p95Latency: number;
  totalFailures: string;
  inputTokensPerSecond: number;
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData[]>([]);
  const [aggregate, setAggregate] = useState<Aggregate>({
    numberOfRequests: "0",
    averageLatency: 0,
    p95Latency: 0,
    totalFailures: "0",
    inputTokensPerSecond: 0,
  });
  const [filter, setFilter] = useState<FilterModel>({
    user: "",
    status: "success",
    model: "gpt-3-turbo",
    latency: 0,
    days: "7",
  });

  const [params, setParams] = useState({
    limit: "10",
    page: 1,
  });

  const [loading, setLoading] = useState(false);

  const handleLimitChange = (selectedLimit: string) => {
    setParams({ ...params, limit: selectedLimit });
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  const handleSelectFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
  };

  async function getData({ page, limit }: { page: number; limit: string }) {
    setLoading(true);
    await fetch(
      `http://localhost:3000/api/dashboard?page=${page - 1}&limit=${limit}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setData(res.result);
        setAggregate(res.aggregate[0]);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  }

  useEffect(() => {
    getData(params);
  }, [params]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // console.log(filter, params);
    setLoading(true);

    await fetch(
      `http://localhost:3000/api/dashboard?page=${params.page - 1}&limit=${
        params.limit
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filter),
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setData(res.result);
        setAggregate(res.aggregate[0]);
      })
      .catch((err) => {
        console.log(err);
      });

    setLoading(false);
  };
  return (
    <div className="w-full md:w-[90%] flex flex-col gap-4 min-h-screen mx-auto overflow-hidden p-2">
      <div className="flex gap-4">
        <Link href="/" className="text-2xl">
          &#8592;
        </Link>
        <h2 className="text-4xl">Dashboard</h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap justify-between gap-4 w-full mx-auto items-center"
      >
        <div className="flex gap-2 items-center justify-between">
          <label htmlFor="user" className="text-xl">
            User:{" "}
          </label>
          <input
            type="text"
            name="user"
            placeholder="Name"
            className="p-1.5 rounded-md border-gray-300 outline-none bg-slate-800 w-40"
            value={filter.user}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex gap-2 items-center justify-between">
          <label htmlFor="status" className="text-xl">
            Status:
          </label>
          <select
            name="status"
            className="p-2 rounded-md border-gray-300 outline-none bg-slate-800 w-40"
            onChange={(e) => handleSelectFilterChange(e)}
            value={filter.status}
          >
            <option value="success">success</option>
            <option value="failure">failure</option>
          </select>
        </div>
        <div className="flex gap-2 items-center justify-between">
          <label htmlFor="model" className="text-xl">
            Model:
          </label>
          <select
            name="model"
            className="p-2 rounded-md border-gray-300 outline-none bg-slate-800 w-40"
            onChange={(e) => handleSelectFilterChange(e)}
            value={filter.model}
          >
            <option value="gpt-3-turbo">gpt-3-turbo</option>
            <option value="gpt-4">gpt-4</option>
          </select>
        </div>
        <div className="flex gap-2 items-center justify-between">
          <label htmlFor="latency" className="text-xl">
            Latency:
          </label>
          <input
            type="number"
            name="latency"
            placeholder="Latency"
            className="p-1.5 rounded-md border-gray-300 outline-none bg-slate-800 w-40"
            value={filter.latency}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex gap-2 items-center justify-between">
          <label htmlFor="days" className="text-xl">
            Days:
          </label>
          <select
            name="days"
            className="p-2 rounded-md border-gray-300 outline-none bg-slate-800 w-40"
            onChange={(e) => handleSelectFilterChange(e)}
            value={filter.days}
          >
            <option value="7">7</option>
            <option value="14">14</option>
            <option value="30">30</option>
            <option value="60">60</option>
            <option value="90">90</option>
          </select>
        </div>

        <button
          className="border border-gray-300 rounded-md p-2 w-40 hover:bg-white hover:text-black ease-in-out duration-300 transition-colors ml-auto"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading" : "Extract"}
        </button>
      </form>
      {loading ? (
        <LoadingTableSkeleton />
      ) : data.length === 0 ? (
        <NoData />
      ) : (
        <div className="w-full overflow-hidden flex flex-col gap-2">
          <div className="flex justify-between items-center w-full gap-2">
            <span>Number Of Requests: {aggregate?.numberOfRequests}</span>
            <span>Average Latency: {aggregate?.averageLatency}</span>
            <span>p95 Latency: {aggregate?.p95Latency}</span>
            <span>Total Failures: {aggregate?.totalFailures}</span>
            <span>
              Input Tokens Per Second: {aggregate?.inputTokensPerSecond}
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
            <div className="relative">
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
    </div>
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
export default Dashboard;
