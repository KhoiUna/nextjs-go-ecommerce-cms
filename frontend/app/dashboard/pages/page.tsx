"use client";

import TextLoader from "@/components/ui/TextLoader";
import { useQuery } from "@tanstack/react-query";
import { MenuOrderSort } from "./MenuOrderSort";
import { MenuItem } from "@/types/types";
import { AddPage } from "./AddPage";
import { useEffect, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";

interface GetMenuItemsResponse {
	errorMessage: string;
	hasError: boolean;
	metadata: null | {
		[key: string]: any;
	};
	payload: MenuItem[];
}

export default function Pages() {
	const { data, refetch } = useQuery<any, any, GetMenuItemsResponse, any>({
		queryKey: ["pages"],
		queryFn: async () => {
			const res = await fetch("/api/page");
			const data = await res.json();
			return data;
		},
	});

	const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
	useEffect(
		function initializeMenuItems() {
			if (data) setMenuItems(data.payload);
		},
		[data]
	);

	const [isTriggeredSaveOrder, setIsTriggeredSaveOrder] = useState(false);
	useEffect(
		function updateMenuOrder() {
			if (isTriggeredSaveOrder)
				fetch("/api/page", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ menuItems }),
				})
					.then((res) => res.json())
					.then((res) => {
						if (res.hasError) throw new Error(res.errorMessage);
						toast.success("Order saved successfully");
					})
					.catch((error) => {
						toast.error(error.message);
					});

			return () => {
				setIsTriggeredSaveOrder(false);
			};
		},
		[menuItems, isTriggeredSaveOrder]
	);

	if (!data || !menuItems)
		return (
			<>
				<h1 className="text-3xl font-bold">Pages</h1>
				<TextLoader loadingText="Loading" />
			</>
		);

	const addPage = (newPage: MenuItem) =>
		setMenuItems((prev) => (!prev ? prev : [...prev, newPage]));

	const deletePage = (id: MenuItem["ID"]) =>
		setMenuItems((prev) =>
			!prev ? prev : prev.filter((item) => item.ID !== id)
		);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!active || !over) return;
		if (active.id !== over.id) {
			setMenuItems((items) => {
				if (!items) return null;

				const oldIndex = items.findIndex(
					(item) => item.slug === active.id
				);
				const newIndex = items.findIndex(
					(item) => item.slug === over.id
				);
				return arrayMove(items, oldIndex, newIndex);
			});
			setIsTriggeredSaveOrder(true);
		}
	};

	return (
		<>
			<h1 className="text-3xl font-bold">Pages</h1>
			<p className="pb-10 pt-1 text-slate-700">Hold & drag to reorder</p>
			{menuItems.length === 0 && (
				<p className="text-center pb-5 italic text-slate-600">
					No pages added yet
				</p>
			)}
			<MenuOrderSort
				menuItems={menuItems}
				handleDragEnd={handleDragEnd}
				deletePage={deletePage}
				refetch={refetch}
			/>
			<AddPage addPage={addPage} />
		</>
	);
}
