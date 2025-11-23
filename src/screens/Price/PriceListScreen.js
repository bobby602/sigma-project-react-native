// src/screens/Price/PriceListScreen.js
// 💰 Price List Screen with Inline Editing (Styled)

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  fetchPriceList,
  setPage,
  setFilters,
  updatePrice,
  addPendingChange,
  clearPendingChanges,
} from '../../store/priceSlice';
import { debounce, formatCurrency } from '../../utils/helpers';

export default function PriceListScreen() {
  const dispatch = useDispatch();

  const {
    priceList,
    pagination,
    filters,
    pendingChanges,
    isLoading,
    isSaving,
  } = useSelector(state => state.price);

  const [searchText, setSearchText] = useState(filters.search);
  const [refreshing, setRefreshing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    dispatch(
      fetchPriceList({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        departCode: filters.departCode,
      }),
    );
  }, [dispatch, pagination.page, filters.search, filters.departCode]);

  const debouncedSearch = useCallback(
    debounce(text => {
      dispatch(setFilters({ search: text }));
      dispatch(setPage(1));
    }, 500),
    [dispatch],
  );

  const handleSearch = text => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(
      fetchPriceList({
        page: 1,
        limit: pagination.limit,
        search: filters.search,
        departCode: filters.departCode,
      }),
    );
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!isLoading && pagination.page < pagination.totalPages) {
      dispatch(setPage(pagination.page + 1));
    }
  };

  const handlePriceEdit = (item, field, value) => {
    const key = `${item.ItemCode}-${field}`;
    dispatch(
      addPendingChange({
        key,
        value: {
          ItemCode: item.ItemCode,
          field,
          value: parseFloat(value) || 0,
        },
      }),
    );
  };

  const handleSavePrice = async item => {
    try {
      await dispatch(
        updatePrice({
          ItemCode: item.ItemCode,
          ...item,
        }),
      ).unwrap();

      Alert.alert('สำเร็จ', 'บันทึกราคาเรียบร้อยแล้ว');
      setEditingItem(null);
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถบันทึกราคาได้');
    }
  };

  const pendingCount = pendingChanges
    ? Object.keys(pendingChanges).length
    : 0;

  const renderPrice = ({ item }) => {
    const isEditing = editingItem?.ItemCode === item.ItemCode;

    return (
      <View style={[styles.priceCard, isEditing && styles.priceCardEditing]}>
        <View style={styles.priceHeader}>
          <View>
            <Text style={styles.priceCode}>{item.ItemCode}</Text>
            <Text style={styles.priceName} numberOfLines={2}>
              {item.Name || item.NameFG || '-'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setEditingItem(isEditing ? null : item)}
            style={styles.editButton}
          >
            <Icon
              name={isEditing ? 'close' : 'create-outline'}
              size={20}
              color={isEditing ? '#ef4444' : '#0ea5e9'}
            />
          </TouchableOpacity>
        </View>

        {isEditing && (
          <View style={styles.editingBanner}>
            <Icon
              name="information-circle-outline"
              size={14}
              color="#0ea5e9"
            />
            <Text style={styles.editingBannerText}>
              แก้ไขราคาขายและต้นทุน จากนั้นกดปุ่ม &quot;บันทึก&quot; ด้านล่าง
            </Text>
          </View>
        )}

        <View style={styles.priceGrid}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>ราคาขาย</Text>
            {isEditing ? (
              <TextInput
                style={styles.priceInput}
                defaultValue={String(item.Price || 0)}
                keyboardType="numeric"
                onChangeText={value =>
                  handlePriceEdit(item, 'Price', value)
                }
              />
            ) : (
              <Text style={styles.priceValue}>
                ฿{formatCurrency(item.Price || 0)}
              </Text>
            )}
          </View>

          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>ต้นทุน</Text>
            {isEditing ? (
              <TextInput
                style={styles.priceInput}
                defaultValue={String(item.CostN || 0)}
                keyboardType="numeric"
                onChangeText={value =>
                  handlePriceEdit(item, 'CostN', value)
                }
              />
            ) : (
              <Text style={styles.priceValueCost}>
                ฿{formatCurrency(item.CostN || 0)}
              </Text>
            )}
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handleSavePrice(item)}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Icon name="checkmark" size={20} color="#ffffff" />
                <Text style={styles.saveButtonText}>บันทึก</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>บันทึกราคาสินค้า</Text>
      <Text style={styles.subtitle}>
        แก้ไขราคาขายและต้นทุนได้จากหน้าจอนี้โดยตรง
      </Text>

      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color="#94a3b8"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหาสินค้า (รหัสหรือชื่อสินค้า)..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#94a3b8"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.resultCount}>
        แสดง {priceList.length} จาก {pagination.total || 0} รายการ
      </Text>

      {pendingCount > 0 && (
        <View style={styles.pendingBanner}>
          <Icon
            name="alert-circle-outline"
            size={16}
            color="#92400e"
          />
          <Text style={styles.pendingText}>
            มีราคาแก้ไขค้างอยู่ {pendingCount} ค่า กรุณากด &quot;บันทึก&quot; ที่รายการนั้น ๆ
          </Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0ea5e9" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="pricetag-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyText}>ไม่พบข้อมูลราคา</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={priceList}
        renderItem={renderPrice}
        keyExtractor={(item, index) => `${item.ItemCode}-${index}`}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!isLoading && renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#0ea5e9"
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  resultCount: {
    fontSize: 13,
    color: '#64748b',
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  pendingText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 12,
    color: '#78350f',
  },
  priceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  priceCardEditing: {
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  priceCode: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  priceName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0f172a',
    lineHeight: 20,
  },
  editButton: {
    padding: 4,
  },
  editingBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ecfeff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 10,
  },
  editingBannerText: {
    flex: 1,
    marginLeft: 6,
    fontSize: 11,
    color: '#0369a1',
  },
  priceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceItem: {
    flex: 1,
    marginRight: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  priceValueCost: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22c55e',
  },
  priceInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 4,
    paddingHorizontal: 2,
    backgroundColor: '#f8fafc',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
});
