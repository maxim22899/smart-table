import { makeIndex } from "./lib/utils.js";

export function initData(sourceData) {
  const sellers = makeIndex(
    sourceData.sellers,
    "id",
    (v) => `${v.first_name} ${v.last_name}`,
  );
  const customers = makeIndex(
    sourceData.customers,
    "id",
    (v) => `${v.first_name} ${v.last_name}`,
  );
  const data = sourceData.purchase_records.map((item) => ({
    id: item.receipt_id,
    date: item.date,
    seller: sellers[item.seller_id],
    customer: customers[item.customer_id],
    total: item.total_amount,
  }));

  const getIndexes = async () => {
    return { sellers, customers };
  };

  const getRecords = async (query = {}) => {
    const { limit, page, search, sort } = query;

    let filtered = data;

    if (search) {
      const searchTerm = String(search).toLowerCase();
      filtered = filtered.filter((row) =>
        ["date", "customer", "seller"].some((field) =>
          String(row[field]).toLowerCase().includes(searchTerm),
        ),
      );
    }

    Object.keys(query).forEach((key) => {
      if (key.startsWith("filter[")) {
        const field = key.match(/filter\[(.+)\]/)[1];
        const value = query[key];
        if (value) {
          if (field === "totalFrom") {
            filtered = filtered.filter(
              (row) => Number(row.total) >= Number(value),
            );
          } else if (field === "totalTo") {
            filtered = filtered.filter(
              (row) => Number(row.total) <= Number(value),
            );
          } else {
            filtered = filtered.filter((row) =>
              String(row[field])
                .toLowerCase()
                .includes(String(value).toLowerCase()),
            );
          }
        }
      }
    });

    if (sort) {
      const [field, order] = sort.split(":");

      filtered = [...filtered].sort((a, b) => {
        if (a[field] < b[field]) return order === "up" ? -1 : 1;
        if (a[field] > b[field]) return order === "up" ? 1 : -1;
      });
    }

    if (!limit || !page) {
      return {
        total: filtered.length,
        items: filtered,
      };
    }

    const skip = (page - 1) * limit;
    const items = filtered.slice(skip, skip + limit);

    return {
      total: filtered.length,
      items,
    };
  };

  return {
    getIndexes,
    getRecords,
  };
}
