import { NextResponse } from "next/server";

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: string;
  details?: unknown;
};

export type ApiResult<T> = ApiSuccess<T> | ApiError;

export function jsonSuccess<T>(
  data: T,
  init?: ResponseInit & { message?: string }
) {
  const { message, ...responseInit } = init ?? {};
  const body: ApiSuccess<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
  return NextResponse.json(body, { status: 200, ...responseInit });
}

export function jsonCreated<T>(data: T, message?: string) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
  return NextResponse.json(body, { status: 201 });
}

export function jsonError(
  error: string,
  status = 400,
  details?: unknown
) {
  const body: ApiError = {
    success: false,
    error,
    ...(details !== undefined ? { details } : {}),
  };
  return NextResponse.json(body, { status });
}
