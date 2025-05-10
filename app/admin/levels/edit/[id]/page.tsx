"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Play, ArrowLeft, Save, Trash, Eraser, ChevronRight, CoinsIcon as Coin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Navigation from "@/components/ui/navigation"
import { ApiController } from "@/app/services/apiController"

// Define the types for our level data
interface Point {
  x: number
  y: number
}

interface BlockData {
  BlockType: number
  IsHasCoin: boolean
  PointMap: Point
}

interface LevelData {
  DirPlayerStart: Point
  PointPlayerStart: Point
  ListDataMap: BlockData[]
  CoinInGame: number
}

interface Level {
  maCapDo: number
  duLieuCapDo: string
  thoiGianCapNhat: string
  CAPDONGUOICHOIs?: any[]
}

// Block type definitions
const blockTypes = [
  { id: 1, name: "Empty", color: "bg-white border border-gray-200", icon: <Eraser className="h-4 w-4" /> },
  { id: 2, name: "Normal", color: "bg-rose-200", icon: <div className="h-4 w-4 bg-rose-200 rounded-sm" /> },
  { id: 3, name: "Decor", color: "bg-yellow-200", icon: <div className="h-4 w-4 bg-yellow-200 rounded-sm" /> },
  { id: 4, name: "Danger", color: "bg-green-200", icon: <div className="h-4 w-4 bg-green-200 rounded-sm" /> },
  { id: 5, name: "Higher", color: "bg-red-200", icon: <div className="h-4 w-4 bg-red-200 rounded-sm" /> },
  { id: 6, name: "Special", color: "bg-blue-200", icon: <div className="h-4 w-4 bg-blue-200 rounded-sm" /> },
]

export default function EditLevelPage() {
  const router = useRouter();
  const params = useParams();
  
  // Safely parse levelId and handle invalid values
  const levelIdParam = params.id;
  const levelId = typeof levelIdParam === 'string' ? Number.parseInt(levelIdParam) : 0;
  
  // State for validation
  const [isValidId, setIsValidId] = useState(true);

  // State for the level data
  const [levelData, setLevelData] = useState<LevelData>({
    DirPlayerStart: { x: 0, y: 1 },
    PointPlayerStart: { x: 0, y: 0 },
    ListDataMap: [],
    CoinInGame: 0,
  });

  // State for the original level object from API
  const [originalLevel, setOriginalLevel] = useState<Level | null>(null);

  // State for UI
  const [selectedBlockType, setSelectedBlockType] = useState(1);
  const [hasCoin, setHasCoin] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDraggingPlayer, setIsDraggingPlayer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate ID on mount
  useEffect(() => {
    if (isNaN(levelId) || levelId <= 0) {
      setIsValidId(false);
      setError("Invalid level ID");
    } else {
      setIsValidId(true);
    }
  }, [levelId]);

  // Fetch level data on mount
  useEffect(() => {
    if (!isValidId) return;
    
    const fetchLevel = async () => {
      try {
        setIsLoading(true);
        const apiController = new ApiController();
        const data = await apiController.get<Level[]>('/CapDo');
        
        const level = data.find(l => l.maCapDo === levelId);
        if (!level) {
          throw new Error(`Level with ID ${levelId} not found`);
        }

        setOriginalLevel(level);
        
        // Parse the level data JSON
        const parsedLevelData = JSON.parse(level.duLieuCapDo) as LevelData;
        setLevelData(parsedLevelData);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching level:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevel();
  }, [levelId, isValidId]);

  // Initialize the grid with empty blocks if no level data is loaded
  useEffect(() => {
    if (levelData.ListDataMap.length === 0) {
      const initialBlocks: BlockData[] = [];
      for (let y = 0; y < 6; y++) {
        for (let x = 0; x < 6; x++) {
          initialBlocks.push({
            BlockType: 1, // Empty
            IsHasCoin: false,
            PointMap: { x, y },
          });
        }
      }
      setLevelData((prev) => ({
        ...prev,
        ListDataMap: initialBlocks,
      }));
    }
  }, [levelData.ListDataMap.length]);

  // Update the total coin count whenever the grid changes
  useEffect(() => {
    const coinCount = levelData.ListDataMap.filter((block) => block.IsHasCoin).length;
    setLevelData((prev) => ({
      ...prev,
      CoinInGame: coinCount,
    }));
  }, [levelData.ListDataMap]);

  // Handle block click
  const handleBlockClick = (x: number, y: number) => {
    setLevelData((prev) => {
      const newBlocks = [...prev.ListDataMap];
      const blockIndex = newBlocks.findIndex((block) => block.PointMap.x === x && block.PointMap.y === y);

      if (blockIndex !== -1) {
        newBlocks[blockIndex] = {
          ...newBlocks[blockIndex],
          BlockType: selectedBlockType,
          IsHasCoin: hasCoin,
        };
      }

      return {
        ...prev,
        ListDataMap: newBlocks,
      };
    });
  };

  // Handle mouse down on a block
  const handleMouseDown = (x: number, y: number, isPlayerPosition: boolean) => {
    // Always allow drawing regardless of player position
    setIsDrawing(true);
    handleBlockClick(x, y);

    // Only set dragging player if we're specifically clicking on the player icon
    // and not trying to modify the block
    if (isPlayerPosition && !isDrawing) {
      setIsDraggingPlayer(true);
    }
  };

  // Handle mouse enter on a block while drawing
  const handleMouseEnter = (x: number, y: number) => {
    if (isDrawing) {
      handleBlockClick(x, y);
    } else if (isDraggingPlayer) {
      handlePlayerPositionChange(x, y);
    }
  };

  // Handle mouse up to stop drawing
  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsDraggingPlayer(false);
  };

  // Handle player position change
  const handlePlayerPositionChange = (x: number, y: number) => {
    if (isDraggingPlayer) {
      setLevelData((prev) => ({
        ...prev,
        PointPlayerStart: { x, y },
      }));
    }
  };

  // Handle input change for player start position
  const handlePlayerStartChange = (axis: "x" | "y", value: string) => {
    const numValue = Number.parseInt(value) || 0;
    setLevelData((prev) => ({
      ...prev,
      PointPlayerStart: {
        ...prev.PointPlayerStart,
        [axis]: numValue,
      },
    }));
  };

  // Handle input change for player direction
  const handleDirectionChange = (axis: "x" | "y", value: string) => {
    const numValue = Number.parseInt(value) || 0;
    setLevelData((prev) => ({
      ...prev,
      DirPlayerStart: {
        ...prev.DirPlayerStart,
        [axis]: numValue,
      },
    }));
  };

  // Clear the grid
  const handleClearGrid = () => {
    if (confirm("Are you sure you want to clear the grid? This action cannot be undone.")) {
      const clearedBlocks = levelData.ListDataMap.map((block) => ({
        ...block,
        BlockType: 1, // Empty
        IsHasCoin: false,
      }));

      setLevelData((prev) => ({
        ...prev,
        ListDataMap: clearedBlocks,
      }));
    }
  };

  // Save the level
  const handleSaveLevel = async () => {
    if (!originalLevel) {
      setError("Cannot update level: original level data not found");
      return;
    }

    try {
      setIsSaving(true);
      
      // Format the level data as a JSON string
      const formattedLevelData = JSON.stringify(levelData);
      
      // Create API controller
      const apiController = new ApiController();
      
      // Create the payload for API - include the level ID
      const payload = {
        maCapDo: levelId,
        duLieuCapDo: formattedLevelData,
        thoiGianCapNhat: new Date().toISOString()
      };
      
      // Send the data to the API
      await apiController.put(`/CapDo/${levelId}`, payload);
      
      alert(`Level ${levelId} updated successfully!`);
      router.push('/admin/levels'); // Redirect to levels page after saving
    } catch (error) {
      console.error("Error updating level:", error);
      setError(error instanceof Error ? error.message : "An error occurred when updating the level");
    } finally {
      setIsSaving(false);
    }
  };

  // Get block at position
  const getBlockAt = (x: number, y: number) => {
    return levelData.ListDataMap.find((block) => block.PointMap.x === x && block.PointMap.y === y);
  };

  // Get block color based on block type
  const getBlockColor = (blockType: number) => {
    const block = blockTypes.find((type) => type.id === blockType);
    return block ? block.color : "bg-gray-200";
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          <span className="ml-3 text-rose-500">Loading level data...</span>
        </div>
      </div>
    );
  }

  // Show error state for invalid ID
  if (!isValidId) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <Link href="/admin/levels" className="flex items-center text-rose-500 hover:text-rose-600">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Levels
              </Link>
            </div>
            
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-rose-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-rose-50 text-rose-800 rounded-md">
                  <p>Invalid level ID. Please select a valid level from the levels page.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => router.push('/admin/levels')}
                  className="bg-rose-500 hover:bg-rose-600"
                >
                  Return to Levels
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link href="/admin/levels" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Levels
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-rose-500">Edit Level {levelId}</h1>
            <p className="text-gray-600 mt-1">Modify an existing level for your game</p>
            {error && (
              <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Tools */}
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-md">
                <CardHeader className="bg-rose-500 text-white">
                  <CardTitle>Block Types</CardTitle>
                  <CardDescription className="text-rose-100">Select a block type to draw</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <TooltipProvider>
                      {blockTypes.map((blockType) => (
                        <Tooltip key={blockType.id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={selectedBlockType === blockType.id ? "default" : "outline"}
                              className={`w-full justify-start ${
                                selectedBlockType === blockType.id ? "bg-rose-500 text-white" : ""
                              }`}
                              onClick={() => setSelectedBlockType(blockType.id)}
                            >
                              <div
                                className={`w-6 h-6 mr-2 ${blockType.color} rounded flex items-center justify-center`}
                              >
                                {blockType.icon}
                              </div>
                              <span>{blockType.name}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Block Type {blockType.id}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="hasCoin"
                          checked={hasCoin}
                          onChange={(e) => setHasCoin(e.target.checked)}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                        />
                        <Label htmlFor="hasCoin" className="flex items-center cursor-pointer">
                          <Coin className="h-4 w-4 mr-2 text-yellow-500" />
                          Has Coin
                        </Label>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <Button
                      variant="outline"
                      className="w-full border-red-500 text-red-500 hover:bg-red-50"
                      onClick={handleClearGrid}
                      disabled={isSaving}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Clear Grid
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md mt-6">
                <CardHeader>
                  <CardTitle>Level Properties</CardTitle>
                  <CardDescription>Configure level settings</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="playerStartX">Player Start Position</Label>
                    <div className="flex space-x-2">
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="playerStartX" className="text-xs text-gray-500">
                          X
                        </Label>
                        <Input
                          id="playerStartX"
                          type="number"
                          min="0"
                          max="5"
                          value={levelData.PointPlayerStart.x}
                          onChange={(e) => handlePlayerStartChange("x", e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="playerStartY" className="text-xs text-gray-500">
                          Y
                        </Label>
                        <Input
                          id="playerStartY"
                          type="number"
                          min="0"
                          max="5"
                          value={levelData.PointPlayerStart.y}
                          onChange={(e) => handlePlayerStartChange("y", e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="directionX">Player Direction</Label>
                    <div className="flex space-x-2">
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="directionX" className="text-xs text-gray-500">
                          X
                        </Label>
                        <Input
                          id="directionX"
                          type="number"
                          min="-1"
                          max="1"
                          value={levelData.DirPlayerStart.x}
                          onChange={(e) => handleDirectionChange("x", e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="directionY" className="text-xs text-gray-500">
                          Y
                        </Label>
                        <Input
                          id="directionY"
                          type="number"
                          min="-1"
                          max="1"
                          value={levelData.DirPlayerStart.y}
                          onChange={(e) => handleDirectionChange("y", e.target.value)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-md mt-6">
                <CardHeader>
                  <CardTitle>Level Statistics</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Coins:</span>
                      <span className="font-bold text-yellow-500 flex items-center">
                        <Coin className="h-4 w-4 mr-1" />
                        {levelData.CoinInGame}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Player Position:</span>
                      <span className="font-bold">
                        ({levelData.PointPlayerStart.x}, {levelData.PointPlayerStart.y})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Direction:</span>
                      <span className="font-bold">
                        ({levelData.DirPlayerStart.x}, {levelData.DirPlayerStart.y})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level ID:</span>
                      <span className="font-bold">{levelId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Grid */}
            <div className="lg:col-span-9">
              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle>Level Grid</CardTitle>
                  <CardDescription>Click and drag to draw blocks</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div
                    className="grid grid-cols-6 gap-1 max-w-3xl mx-auto"
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {Array.from({ length: 6 }).map((_, y) =>
                      Array.from({ length: 6 }).map((_, x) => {
                        const block = getBlockAt(x, y);
                        const isPlayerStart = levelData.PointPlayerStart.x === x && levelData.PointPlayerStart.y === y;

                        return (
                          <div
                            key={`${x}-${y}`}
                            className={`aspect-square ${
                              block ? getBlockColor(block.BlockType) : "bg-gray-100"
                            } relative flex items-center justify-center border border-gray-200 hover:border-rose-500 cursor-pointer transition-all duration-150 transform hover:scale-105`}
                            onMouseDown={() => handleMouseDown(x, y, isPlayerStart)}
                            onMouseEnter={() => {
                              handleMouseEnter(x, y);
                              if (isDraggingPlayer) handlePlayerPositionChange(x, y);
                            }}
                          >
                            {/* Coordinate label */}
                            <div className="absolute top-1 left-1 text-xs font-medium text-gray-700 pointer-events-none">
                              {x}/{y}
                            </div>

                            {/* Player position indicator */}
                            {isPlayerStart && (
                              <div className="absolute w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center z-10">
                                <ChevronRight
                                  className="h-4 w-4 text-white"
                                  style={{
                                    transform: `rotate(${Math.atan2(levelData.DirPlayerStart.y, levelData.DirPlayerStart.x) * (180 / Math.PI)}deg)`,
                                  }}
                                />
                              </div>
                            )}

                            {/* Coin indicator */}
                            {block?.IsHasCoin && (
                              <div className="absolute w-4 h-4 rounded-full bg-yellow-400 z-5 flex items-center justify-center">
                                <Coin className="h-3 w-3 text-yellow-600" />
                              </div>
                            )}
                          </div>
                        );
                      }),
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleClearGrid} disabled={isSaving}>
                    <Trash className="h-4 w-4 mr-2" />
                    Clear Grid
                  </Button>
                  <Button 
                    className="bg-rose-500 hover:bg-rose-600" 
                    onClick={handleSaveLevel} 
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Level
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white shadow-md mt-6">
                <CardHeader>
                  <CardTitle>Level Preview</CardTitle>
                  <CardDescription>JSON representation of your level</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[200px]">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(levelData, null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
