'use client'

import { useState} from 'react'
import { Button } from '../../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Input } from '../../components/ui/input'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/ui/select";
import {addListing} from "../actions";

export default function ListCard() {
    const [isOpen, setIsOpen] = useState(false)
    const [location, setLocation] = useState("")
    const [condition, setCondition] = useState("")
    const [price, setPrice] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await addListing({condition, price});
        setIsOpen(false)
    }

    return (
        <div className="fixed bottom-8 right-8">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button size="lg" className="rounded-full shadow-lg">
                        List a Card
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>List a Card</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                                Card Name
                            </label>
                            <Input
                                id="cardName"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Search for a card..."
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                                Condition
                            </label>
                            <Select value={condition} onValueChange={setCondition}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mint">Mint</SelectItem>
                                    <SelectItem value="near_mint">Near Mint</SelectItem>
                                    <SelectItem value="played">Played</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price (ZAR)
                            </label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Enter price in ZAR"
                                className="mt-1"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            List Card
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
