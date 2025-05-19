<div class="bg-gray-900 min-h-screen text-white py-8 px-4">
    <div class="max-w-7xl mx-auto">

        {{-- Filtros de búsqueda --}}
        <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label>Buscar por:</label>
                <input
                    wire:model.live.debounce.300ms="search"
                    type="text"
                    placeholder="Cerca..."
                    class="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring focus:ring-violet-500 placeholder-gray-400"
                />
            </div>

            <div>
                <label>Categoria</label>
                <select
                    wire:model.live="type"
                    class="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring focus:ring-violet-500 text-white"
                >
                    <option value="">Tots els tipus</option>
                    @foreach($types as $t)
                        <option value="{{ $t->id }}">{{ ucfirst($t->name) }}</option>
                    @endforeach
                </select>
            </div>

            <div>
                Items por pagina
                <select
                    wire:model.live="items"
                    class="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring focus:ring-violet-500 text-white"
                >
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                </select>
            </div>

        </div>

        {{-- Resultats --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            @forelse($products as $product)
                <div class="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
                    @if($product->image)
                        <img
                            src="{{ asset('storage/' . $product->image) }}"
                            alt="{{ $product->name }}"
                            class="w-full h-48 object-cover"
                        >
                    @endif
                    <div class="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <h5 class="text-xl font-semibold mb-2">{{ $product->name }}</h5>
                            <p class="text-gray-300 text-sm">{{ Str::limit($product->description, 80) }}</p>
                        </div>
                        <div class="mt-4 text-lg font-bold text-end">
                            <div>
                                Qty: <span>{{ $product->quantity }}</span>
                            </div>
                            <div class="text-violet-400">
                                {{ $product->price }} €
                            </div>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-full text-center text-gray-400">Cap producte trobat.</div>
            @endforelse
        </div>

        {{-- Paginació --}}
        <div class="mt-8">
            {{ $products->links('pagination::tailwind') }}
        </div>
    </div>

    {{-- Script Livewire --}}
    <script>
        document.addEventListener('livewire:load', () => {
            console.log('✅ Livewire està carregat correctament');
        });
    </script>
</div>
