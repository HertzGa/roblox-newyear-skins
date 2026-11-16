-- ============================================================
--  Новогодние сани «Дед Мороз» — сборка одной командой
--  Roblox Studio → View → Command Bar → вставить → Enter
--  Модель появится в Workspace под именем NewYearSleigh
-- ============================================================

local Workspace = game:GetService("Workspace")

local old = Workspace:FindFirstChild("NewYearSleigh")
if old then
	old:Destroy()
end

local RED = Color3.fromHex("#A5122A")
local WOOD = Color3.fromHex("#6D3A22")
local WOOD_DARK = Color3.fromHex("#442315")
local GOLD = Color3.fromHex("#E6B45C")
local METAL = Color3.fromHex("#9FB2C8")
local LAMP = Color3.fromHex("#FFD79A")
local LEATHER = Color3.fromHex("#3A2A20")

local sleigh = Instance.new("Model")
sleigh.Name = "NewYearSleigh"

-- Базовая точка: сани стоят в (0, 0, 0), нос смотрит в +Z
local origin = CFrame.new(0, 0, 0)

local function part(name, size, offset, color, material, parent)
	local p = Instance.new("Part")
	p.Name = name
	p.Size = size
	p.CFrame = origin * offset
	p.Anchored = true
	p.CanCollide = true
	p.Color = color
	p.Material = material or Enum.Material.SmoothPlastic
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	p.Parent = parent or sleigh
	return p
end

-- Пол и борта
local floor = part("Floor", Vector3.new(2.6, 0.18, 4.2), CFrame.new(0, 1.16, 0), WOOD, Enum.Material.Wood)
sleigh.PrimaryPart = floor

part("SideLeft", Vector3.new(0.16, 1, 4.2), CFrame.new(-1.3, 1.72, 0), RED)
part("SideRight", Vector3.new(0.16, 1, 4.2), CFrame.new(1.3, 1.72, 0), RED)
part("RailLeft", Vector3.new(0.2, 0.1, 4.3), CFrame.new(-1.3, 2.24, 0), GOLD, Enum.Material.Metal)
part("RailRight", Vector3.new(0.2, 0.1, 4.3), CFrame.new(1.3, 2.24, 0), GOLD, Enum.Material.Metal)

-- Задняя стенка и передний щит
part("BackPanel", Vector3.new(2.7, 1.5, 0.16), CFrame.new(0, 1.95, -2.05), RED)
part("BackGold", Vector3.new(2.76, 0.12, 0.2), CFrame.new(0, 2.72, -2.05), GOLD, Enum.Material.Metal)
part("FrontShield", Vector3.new(2.6, 0.95, 0.16), CFrame.new(0, 1.7, 2.05), RED)
part("FrontGold", Vector3.new(2.66, 0.12, 0.2), CFrame.new(0, 2.2, 2.05), GOLD, Enum.Material.Metal)

-- Сиденье водителя: лицом к оленям (+Z), спиной к спинке
local seat = Instance.new("Seat")
seat.Name = "DriverSeat"
seat.Size = Vector3.new(2.2, 0.22, 1)
seat.CFrame = origin * CFrame.new(0, 1.62, -0.85) * CFrame.Angles(0, math.pi, 0)
seat.Anchored = true
seat.Color = WOOD_DARK
seat.Material = Enum.Material.Wood
seat.Transparency = 0
seat.Parent = sleigh

part("SeatBack", Vector3.new(2.2, 0.95, 0.18), CFrame.new(0, 2.2, -1.5), WOOD, Enum.Material.Wood)
part("SeatBackGold", Vector3.new(2.3, 0.1, 0.22), CFrame.new(0, 2.68, -1.5), GOLD, Enum.Material.Metal)

-- Полозья, загнутые носы и стойки
for _, sx in ipairs({ -1, 1 }) do
	local x = sx * 1.42
	part("Runner", Vector3.new(0.16, 0.16, 4.8), CFrame.new(x, 0.3, 0.1), METAL, Enum.Material.Metal)
	part("RunnerTip", Vector3.new(0.16, 0.16, 0.95),
		CFrame.new(x, 0.62, 2.62) * CFrame.Angles(math.rad(-32), 0, 0), METAL, Enum.Material.Metal)
	for _, z in ipairs({ -1.3, 0, 1.3 }) do
		part("Strut", Vector3.new(0.14, 0.9, 0.14), CFrame.new(x, 0.8, z), METAL, Enum.Material.Metal)
	end
end

-- Фонарь на переднем борту: столб, две золотые крышки, неоновый шар
part("LampPole", Vector3.new(0.1, 1.3, 0.1), CFrame.new(-1.08, 2.92, 1.9), METAL, Enum.Material.Metal)

local lampCapLow = part("LampCapLow", Vector3.new(0.06, 0.34, 0.34), CFrame.new(-1.08, 3.56, 1.9), GOLD, Enum.Material.Metal)
lampCapLow.Shape = Enum.PartType.Cylinder
lampCapLow.CFrame = lampCapLow.CFrame * CFrame.Angles(0, 0, math.rad(90))

local lampCapTop = part("LampCapTop", Vector3.new(0.06, 0.34, 0.34), CFrame.new(-1.08, 3.86, 1.9), GOLD, Enum.Material.Metal)
lampCapTop.Shape = Enum.PartType.Cylinder
lampCapTop.CFrame = lampCapTop.CFrame * CFrame.Angles(0, 0, math.rad(90))

local glass = Instance.new("Part")
glass.Name = "LampGlass"
glass.Shape = Enum.PartType.Ball
glass.Size = Vector3.new(0.4, 0.4, 0.4)
glass.CFrame = origin * CFrame.new(-1.08, 3.71, 1.9)
glass.Anchored = true
glass.CanCollide = false
glass.Color = LAMP
glass.Material = Enum.Material.Neon
glass.Parent = sleigh

local glow = Instance.new("PointLight")
glow.Color = Color3.fromHex("#FFC879")
glow.Brightness = 2
glow.Range = 14
glow.Shadows = true
glow.Parent = glass

-- Бубенцы на бортах
for _, z in ipairs({ -1.4, 0, 1.4 }) do
	for _, sx in ipairs({ -1, 1 }) do
		local bell = Instance.new("Part")
		bell.Name = "Bell"
		bell.Shape = Enum.PartType.Ball
		bell.Size = Vector3.new(0.18, 0.18, 0.18)
		bell.CFrame = origin * CFrame.new(sx * 1.44, 2.32, z)
		bell.Anchored = true
		bell.CanCollide = false
		bell.Color = GOLD
		bell.Material = Enum.Material.Metal
		bell.Parent = sleigh
	end
end

-- Упряжь: два повода к оленям (декоративные, не физика)
for _, sx in ipairs({ -1, 1 }) do
	local rein = part("Rein", Vector3.new(0.07, 0.07, 2.4),
		CFrame.new(sx * 0.55, 2.05, 3.1) * CFrame.Angles(math.rad(-4), math.rad(sx * 12), 0), LEATHER)
	rein.CanCollide = false
end
-- Украшение на спинке: золотая снежинка из трёх перекрещенных реек
for i = 0, 2 do
	local bar = part("BackFlake", Vector3.new(0.9, 0.1, 0.06),
		CFrame.new(0, 2.25, -2.15) * CFrame.Angles(0, 0, math.rad(i * 60)), GOLD, Enum.Material.Metal)
	bar.CanCollide = false
end

-- Подарки на полу саней
local gifts = {
	{ Vector3.new(0.5, 0.5, 0.5), Vector3.new(-0.55, 1.5, 0.45), Color3.fromHex("#1F5C3A"), GOLD },
	{ Vector3.new(0.4, 0.4, 0.4), Vector3.new(0.35, 1.45, 1.05), Color3.fromHex("#C0172B"), Color3.fromHex("#F7F3EA") },
	{ Vector3.new(0.55, 0.55, 0.55), Vector3.new(0.62, 1.6, 0.1), GOLD, Color3.fromHex("#C0172B") }
}

for _, g in ipairs(gifts) do
	local size, pos, boxColor, ribbonColor = g[1], g[2], g[3], g[4]
	local box = part("Gift", size, CFrame.new(pos), boxColor)
	box.CanCollide = false
	local r1 = part("GiftRibbon", Vector3.new(size.X + 0.03, size.Y + 0.03, 0.08), CFrame.new(pos), ribbonColor, Enum.Material.Foil)
	r1.CanCollide = false
	local r2 = part("GiftRibbon", Vector3.new(0.08, size.Y + 0.03, size.Z + 0.03), CFrame.new(pos), ribbonColor, Enum.Material.Foil)
	r2.CanCollide = false
end

-- ============================================================
--  Если хочешь катать сани, а не держать их декорацией:
--  1) раскомментируй блок ниже;
--  2) выдели модель и сними галочку Anchored у деталей (или выполни цикл ниже);
--  3) у пола оставь Anchored = true, остальные детали привари к нему.
-- ============================================================
--[[
for _, p in ipairs(sleigh:GetDescendants()) do
	if p:IsA("BasePart") and p ~= floor then
		p.Anchored = false
		local weld = Instance.new("WeldConstraint")
		weld.Part0 = floor
		weld.Part1 = p
		weld.Parent = p
	end
end
floor.Anchored = true
--]]

print("NewYearSleigh готов: сел — DriverSeat, свет — LampGlass, бубенцы — Bell")
