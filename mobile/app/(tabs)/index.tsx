import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="w-full bg-white shadow-md px-6 py-3 flex-row items-center justify-between border-b border-gray-200">
        <Text className="text-xl font-bold text-blue-600">MyApp</Text>

        {/* Search */}
        <View className="flex-1 mx-4">
          <TextInput
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50"
          />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Featured Rooms
          </Text>
          <Text className="text-gray-500">{totalRooms} rooms found</Text>
        </View>

        {loading ? (
          <View className="py-20 items-center">
            <Text className="text-gray-500 font-medium">Loading rooms...</Text>
          </View>
        ) : rooms.length === 0 ? (
          <View className="py-20 items-center bg-white rounded-2xl shadow-sm border border-gray-100">
            <Text className="text-gray-400 text-lg mb-2">No rooms found</Text>
            <Text className="text-gray-400 text-center px-10 text-sm">
              We couldn't find any rooms matching your search. Try adjusting
              your filters.
            </Text>
          </View>
        ) : (
          <View className="gap-4">{/* Map rooms logic would go here */}</View>
        )}

        {/* Pagination logic */}
        {totalPages > 1 && (
          <View className="flex-row justify-center items-center gap-2 mt-8 mb-10">
            <TouchableOpacity
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-full items-center justify-center ${currentPage === 1 ? "bg-gray-200" : "bg-white border border-gray-200 shadow-sm"}`}
            >
              <Text
                className={`${currentPage === 1 ? "text-gray-400" : "text-gray-700"}`}
              >
                {"<"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full items-center justify-center ${currentPage === i + 1 ? "bg-blue-600" : "bg-white border border-gray-200 shadow-sm"}`}
                >
                  <Text
                    className={`${currentPage === i + 1 ? "text-white font-bold" : "text-gray-700"}`}
                  >
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full items-center justify-center ${currentPage === totalPages ? "bg-gray-200" : "bg-white border border-gray-200 shadow-sm"}`}
            >
              <Text
                className={`${currentPage === totalPages ? "text-gray-400" : "text-gray-700"}`}
              >
                {">"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
