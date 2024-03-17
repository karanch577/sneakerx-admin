"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableData {
  [key: string]: any;
}

interface TableHeader {
  column: string;
  dataIndex?: string;
  render?: (data: TableData) => React.ReactElement;
}

interface TableProps<H extends TableHeader, D extends TableData> {
  header: H[];
  data: D[];
}

function TableList<H extends TableHeader, D extends TableData>({
  data,
  header,
}: TableProps<H, D>) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {header.map((item, i) => (
              <React.Fragment key={i}>
                <TableHead>{item.column}</TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="min-h-[300px]">
          {data.length === 0 && (
            <TableRow className="h-[300px]">
              <TableCell colSpan={header.length}>No data available</TableCell>
            </TableRow>
          )}

          {data.length > 0 &&
            data.map((item, i) => (
              <TableRow key={i}>
                {header.map((el, j) => {
                  if (el.render) {
                    return (
                      <React.Fragment key={j}>
                        <TableCell>{el.render(item)}</TableCell>
                      </React.Fragment>
                    );
                  }
                  return (
                    <React.Fragment key={j}>
                      {el.dataIndex ? (
                        <TableCell>{`${item[el.dataIndex]}`}</TableCell>
                      ) : (
                        ""
                      )}
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableList;
