'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/app/actions';

export default function SellPanelClient({ cardId }: { cardId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    setError(null);
    setSuccess(false);
    try {
      await createListing(formData);
      setSuccess(true);
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="bg-white p-6 border-gray-200 border rounded-lg w-full">
      <h2 className="font-bold text-xl mb-4">Put Card for Sale</h2>
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          Listing created!
        </div>
      )}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>
      )}
      <form action={action} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="hidden" name="cardId" value={cardId} />
        <div className="flex flex-col gap-2">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            name="quantity"
            id="quantity"
            type="number"
            min={1}
            defaultValue={1}
            className="border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="language"
            className="text-sm font-medium text-gray-700"
          >
            Language
          </label>
          <select
            name="language"
            id="language"
            className="border-gray-300 rounded-md shadow-sm"
            required
          >
            <option>English</option>
            <option>Dutch</option>
            <option>French</option>
            <option>German</option>
            <option>Spanish</option>
            <option>Italian</option>
            <option>Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="condition"
            className="text-sm font-medium text-gray-700"
          >
            Condition
          </label>
          <select
            name="condition"
            id="condition"
            className="border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="mint">Mint</option>
            <option value="near_mint">Near Mint</option>
            <option value="lightly_played">Lightly Played</option>
            <option value="played">Played</option>
            <option value="heavily_played">Heavily Played</option>
            <option value="poor">Poor</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="comments"
            className="text-sm font-medium text-gray-700"
          >
            Comments
          </label>
          <input
            name="comments"
            id="comments"
            type="text"
            placeholder="Comments"
            className="border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="image" className="text-sm font-medium text-gray-700">
            Image (.jpg)
          </label>
          <input
            name="image"
            id="image"
            type="file"
            accept="image/jpeg"
            className="border-gray-300 rounded-md shadow-sm"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Price
          </label>
          <div className="flex items-center gap-2">
            <input
              name="price"
              id="price"
              type="number"
              min={0}
              step={0.01}
              className="border-gray-300 rounded-md shadow-sm w-full"
              required
            />
            <span className="text-gray-500">R</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Special Attributes
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isReverse"
                className="accent-blue-600"
              />
              Reverse
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isSigned"
                className="accent-blue-600"
              />
              Signed
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFirstEdition"
                className="accent-blue-600"
              />
              First Edition
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAltered"
                className="accent-blue-600"
              />
              Altered
            </label>
          </div>
        </div>
        <div className="flex items-end md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-semibold"
          >
            Put for Sale
          </button>
        </div>
      </form>
    </div>
  );
}
