"use client"

import { useEffect, useState } from "react"
import { BuyerHeader } from "@/components/buyer/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingCart, Gavel, Car, User, Leaf, Loader2, Filter, X } from "lucide-react"
import { marketplaceApi, type MarketplaceListing } from "@/lib/api/marketplace"
import { toast } from "sonner"

export default function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [filteredListings, setFilteredListings] = useState<MarketplaceListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null)
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false)
  const [isBidDialogOpen, setIsBidDialogOpen] = useState(false)
  const [buyAmount, setBuyAmount] = useState(0)
  const [bidAmount, setBidAmount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [listingType, setListingType] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [listings, searchTerm, minPrice, maxPrice, listingType])

  const fetchListings = async () => {
    try {
      const response = await marketplaceApi.getActiveListings()
      setListings(response.result || [])
    } catch (error) {
      console.error("Failed to fetch listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...listings]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.sellerName.toLowerCase().includes(term) ||
          l.vehicleModel.toLowerCase().includes(term) ||
          l.licensePlate.toLowerCase().includes(term),
      )
    }

    if (minPrice) {
      filtered = filtered.filter((l) => l.price >= Number(minPrice))
    }

    if (maxPrice) {
      filtered = filtered.filter((l) => l.price <= Number(maxPrice))
    }

    if (listingType !== "all") {
      filtered = filtered.filter((l) => l.listingType === listingType)
    }

    setFilteredListings(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setMinPrice("")
    setMaxPrice("")
    setListingType("all")
  }

  const handleBuyNow = async () => {
    if (!selectedListing) return
    setIsSubmitting(true)
    try {
      await marketplaceApi.buyNow(selectedListing.listingId, buyAmount)
      toast.success("Mua tín chỉ thành công!", {
        description: `Bạn đã mua ${buyAmount} tín chỉ carbon.`,
      })
      setIsBuyDialogOpen(false)
      setBuyAmount(0)
      setSelectedListing(null)
      fetchListings()
    } catch (error) {
      console.error("Failed to buy:", error)
      toast.error("Mua thất bại", {
        description: "Vui lòng kiểm tra số dư ví và thử lại.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlaceBid = async () => {
    if (!selectedListing) return
    setIsSubmitting(true)
    try {
      await marketplaceApi.placeBid(selectedListing.listingId, bidAmount)
      toast.success("Đặt giá thành công!", {
        description: `Giá đấu của bạn: ${formatCurrency(bidAmount)} VND/tín chỉ`,
      })
      setIsBidDialogOpen(false)
      setBidAmount(0)
      setSelectedListing(null)
      fetchListings()
    } catch (error) {
      console.error("Failed to place bid:", error)
      toast.error("Đặt giá thất bại", {
        description: "Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }

  const openBuyDialog = (listing: MarketplaceListing) => {
    setSelectedListing(listing)
    setBuyAmount(1)
    setIsBuyDialogOpen(true)
  }

  const openBidDialog = (listing: MarketplaceListing) => {
    setSelectedListing(listing)
    setBidAmount(0)
    setIsBidDialogOpen(true)
  }

  return (
    <div className="min-h-screen">
      <BuyerHeader title="Sàn giao dịch" description="Mua tín chỉ carbon từ các chủ xe điện" />

      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên người bán, loại xe, biển số..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border/50"
                />
              </div>

              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Bộ lọc
                {(minPrice || maxPrice || listingType !== "all") && (
                  <Badge variant="secondary" className="ml-2">
                    {[minPrice, maxPrice, listingType !== "all"].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Giá tối thiểu (VND/tín chỉ)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Giá tối đa (VND/tín chỉ)</Label>
                    <Input
                      type="number"
                      placeholder="1000000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Loại giao dịch</Label>
                    <Select value={listingType} onValueChange={setListingType}>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="DIRECT_SALE">Bán trực tiếp</SelectItem>
                        <SelectItem value="AUCTION">Đấu giá</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="ghost" onClick={clearFilters} className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Tìm thấy <span className="font-medium text-foreground">{filteredListings.length}</span> tín chỉ
          </p>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredListings.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-12 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium mb-2">Không tìm thấy tín chỉ</p>
              <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((listing) => (
              <Card
                key={listing.listingId}
                className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      variant={listing.listingType === "DIRECT_SALE" ? "default" : "secondary"}
                      className={
                        listing.listingType === "DIRECT_SALE"
                          ? "bg-primary/20 text-primary"
                          : "bg-warning/20 text-warning"
                      }
                    >
                      {listing.listingType === "DIRECT_SALE" ? "Bán trực tiếp" : "Đấu giá"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(listing.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{listing.sellerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {listing.vehicleModel} - {listing.licensePlate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">{listing.amount} tín chỉ</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-secondary/30 mb-4">
                    <p className="text-xs text-muted-foreground">Giá</p>
                    <p className="text-xl font-bold text-foreground">
                      {formatCurrency(listing.price)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">VND/tín chỉ</span>
                    </p>
                  </div>

                  {listing.listingType === "DIRECT_SALE" ? (
                    <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => openBuyDialog(listing)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Mua ngay
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-warning text-warning hover:bg-warning/10 bg-transparent"
                      onClick={() => openBidDialog(listing)}
                    >
                      <Gavel className="h-4 w-4 mr-2" />
                      Đặt giá
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Buy Now Dialog */}
      <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle>Mua tín chỉ carbon</DialogTitle>
            <DialogDescription>Nhập số lượng tín chỉ bạn muốn mua</DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người bán:</span>
                  <span className="font-medium">{selectedListing.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại xe:</span>
                  <span>{selectedListing.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số lượng khả dụng:</span>
                  <span className="font-medium text-primary">{selectedListing.amount} tín chỉ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá:</span>
                  <span className="font-medium">{formatCurrency(selectedListing.price)} VND/tín chỉ</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyAmount">Số lượng muốn mua</Label>
                <Input
                  id="buyAmount"
                  type="number"
                  min={1}
                  max={selectedListing.amount}
                  value={buyAmount || ""}
                  onChange={(e) => setBuyAmount(Math.min(Number(e.target.value), selectedListing.amount))}
                  className="bg-secondary/50 border-border/50"
                />
                <p className="text-xs text-muted-foreground">Tối đa: {selectedListing.amount} tín chỉ</p>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tổng thanh toán:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(buyAmount * selectedListing.price)} VND
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBuyDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleBuyNow}
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting || !buyAmount || buyAmount <= 0}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xác nhận mua"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bid Dialog */}
      <Dialog open={isBidDialogOpen} onOpenChange={setIsBidDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle>Đặt giá đấu</DialogTitle>
            <DialogDescription>Nhập số tiền bạn muốn đấu giá cho tín chỉ này</DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-xl bg-secondary/30 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Người bán:</span>
                  <span className="font-medium">{selectedListing.sellerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số lượng:</span>
                  <span className="font-medium text-primary">{selectedListing.amount} tín chỉ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá khởi điểm:</span>
                  <span className="font-medium">{formatCurrency(selectedListing.price)} VND/tín chỉ</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bidAmount">Giá đấu (VND/tín chỉ)</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  min={selectedListing.price}
                  value={bidAmount || ""}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="bg-secondary/50 border-border/50"
                />
                <p className="text-xs text-muted-foreground">
                  Giá tối thiểu: {formatCurrency(selectedListing.price)} VND
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBidDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handlePlaceBid}
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
              disabled={isSubmitting || !bidAmount || (selectedListing?.price !== undefined && bidAmount < selectedListing.price)}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Đặt giá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
