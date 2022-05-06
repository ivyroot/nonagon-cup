# encode an STL file into code constants for Nonagon Cup contract


if !ARGV[0]
  puts "useage: ruby encode.rb filename"
  return -1
end

filename = ARGV[0]

if !File.exists?(filename)
  puts "File not readable #{filename}"
  return -1
end

puts "ENCODING FILE #{filename}"

$heightMatch = $thickMatch = nil
if ARGV[1] && ARGV[2]
  $heightMatch = ARGV[1]
  $thickMatch = ARGV[2]
  puts "MATCHING BYTES -- HEIGHT #{$heightMatch} THICK #{$thickMatch}"
end

v = []
f = File.open(filename)
f.each_byte {|b| v << b}
puts "FILE BYTES #{v.length}"

# remove header
body = v.drop(84)
tri_count = body.length / 50
puts "FILE BODY BYTES #{body.length} -- TRIANGLES #{tri_count} -- EXPECTED VERTEXES #{tri_count * 12}"

$z_vals = {}

$vertex_vals = []

$program = []
$bottom = ''

$verts0 = []
$prog0 = []
$verts1 = []
$prog1 = []
$verts2 = []
$prog2 = []

$negated_matches = {}

def get32hex(arr, offset)
  "%02X%02X%02X%02X" % arr[offset, 4]
end

def get32hexZero(arr, offset)
  "00000000"
end

def get8HexZero
  "00"
end

def processZero
  $program << get8HexZero
end

def processVertex(arr,offset)
  n_val = get32hex(arr, offset)
  b_prog = $vertex_vals.find_index(n_val)
  if b_prog == nil
    $vertex_vals << n_val
    b_prog = $vertex_vals.length - 1
  end
  prog_hex = "%02X" % b_prog
  $program << prog_hex
end

def processVertexZ(arr,offset)
  z_val = get32hex(arr, offset)
  $z_vals[z_val] = 1

  if arr[offset + 3] == 0
    # zero
    processVertex(arr,offset)
  else
    if ($heightMatch && $thickMatch)
      if z_val == $thickMatch
        $program << "FD"
      elsif z_val == $heightMatch
        $program << "FE"
      else
        raise "UNKNOWN Z VALUE #{z_val}"
      end
    else
      if arr[offset + 2] == 0
        # -2 / bottom
        $bottom = get32hex(arr, offset)
        $program << "FD"
      else
        # top height
        $program << "FE"
      end
    end
  end
end

# process an array of 50 bytes consisting of 1 STL triangle
def processTriangle(arr)

  # SKIP NORMS

  processVertex(arr,12)
  processVertex(arr,16)
  processVertexZ(arr,20)

  processVertex(arr,24)
  processVertex(arr,28)
  processVertexZ(arr,32)

  processVertex(arr,36)
  processVertex(arr,40)
  processVertexZ(arr,44)
end

(0...tri_count).each do |i|
  start_offset = i * 50
  triangle_data = body[start_offset, 50]
  ret = processTriangle(triangle_data)
end

#
# $vertex_vals.each do |n_val|
#   # check if negative version exists
#   m_byte = n_val[6,2]
#   m_i = m_byte.to_i(16)
#   if (m_i & 128) > 0
#     last_byte = m_i & 127
#     pos_val = n_val[0,6] + last_byte.to_s(16)
#     inv_prog =  $vertex_vals.find_index(pos_val)
#     if inv_prog
#       $negated_matches[n_val] = 1
#     end
#   end
#
# end



puts "Created program of length #{$program.length}"
prog_str = $program.join
puts "VERTEXES LENGTH #{$vertex_vals.length}"
puts "Z VALUS: #{$z_vals.keys}"
puts "PROG STRING LENGTH #{prog_str.length}"
puts "NEGATIVE MATCH COUNT #{$negated_matches.keys.count} (not encoded)"


puts ""
puts "bytes4 private constant thick0 = hex'#{$thickMatch}';"
puts "bytes private constant verts0 = hex'#{$vertex_vals.join}';"
puts "bytes private constant prog0 = hex'#{$program.join}';"
