"use client";
import DataTable from "@/components/DataTable";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export type FilterModel = {
  user: string;
  status: string;
  model: string;
  latency: number;
  days: string;
};

export type DashboardData = {
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

export type Aggregate = {
  numberOfRequests: string;
  averageLatency: number;
  p95Latency: number;
  totalFailures: string;
  inputTokensPerSecond: number;
  totalInputTokens: number;
  totalOutputTokens: number;
};

export type Params = {
  limit: string;
  page: number;
};
const Dashboard = () => {
  const [data, setData] = useState<DashboardData[]>([]);
  const [aggregate, setAggregate] = useState<Aggregate>({
    numberOfRequests: "0",
    averageLatency: 0,
    p95Latency: 0,
    totalFailures: "0",
    inputTokensPerSecond: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
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
            <option value="">all</option>
            <option value="gpt-3-turbo">gpt-3-turbo</option>
            <option value="gpt-4">gpt-4</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
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
      <DataTable
        data={data}
        aggregate={aggregate}
        params={params}
        setParams={setParams}
        handleLimitChange={handleLimitChange}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
